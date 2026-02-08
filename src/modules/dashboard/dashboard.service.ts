import { BookingStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAdminStats = async () => {
    const [
        totalUsers,
        activeUsers,
        bannedUsers,
        totalTutors,
        totalStudents,
        totalCategories,
        totalSubjects,
        totalBookings,
        totalReviews,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: "ACTIVE" } }),
        prisma.user.count({ where: { status: "BAN" } }),
        prisma.user.count({ where: { role: "TUTOR" } }),
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.category.count(),
        prisma.subject.count(),
        prisma.booking.count(),
        prisma.review.count(),
    ]);

    return {
        totalUsers,
        activeUsers,
        bannedUsers,
        totalTutors,
        totalStudents,
        totalCategories,
        totalSubjects,
        totalBookings,
        totalReviews,
    };
};

const getTutorStats = async (tutorId: string) => {
    // Find tutor profile by user id
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { tutor_id: tutorId },
        select: { tutor_profile_id: true },
    });

    if (!tutorProfile) {
        return {
            bookings: { total: 0, byStatus: {} },
            totalEarnings: 0,
            reviews: { total: 0, avgRating: 0 },
        };
    }

    const tutorProfileId = tutorProfile.tutor_profile_id;

    const [bookings, bookingsByStatus, earnings, reviews, avgRating] =
        await Promise.all([
            prisma.booking.count({
                where: { tutor_profile_id: tutorProfileId },
            }),
            prisma.booking.groupBy({
                by: ["status"],
                where: { tutor_profile_id: tutorProfileId },
                _count: { status: true },
            }),
            prisma.booking.aggregate({
                where: {
                    tutor_profile_id: tutorProfileId,
                    status: BookingStatus.COMPLETED,
                },
                _sum: { price: true },
            }),
            prisma.review.count({
                where: { tutor_profile_id: tutorProfileId },
            }),
            prisma.review.aggregate({
                where: { tutor_profile_id: tutorProfileId },
                _avg: { rating: true },
            }),
        ]);
    return {
        bookings: {
            total: bookings,
            byStatus: bookingsByStatus.reduce(
                (acc, item) => {
                    acc[item.status] = item._count.status;
                    return acc;
                },
                {} as Record<string, number>,
            ),
        },
        totalEarnings: earnings._sum.price || 0,
        reviews: {
            total: reviews,
            avgRating: avgRating._avg.rating || 0,
        },
    };
};

const getStudentStats = async (studentId: string) => {
    const [totalBookings, bookingsByStatus, totalSpent, reviewsGiven] =
        await Promise.all([
            prisma.booking.count({
                where: { student_id: studentId },
            }),
            prisma.booking.groupBy({
                by: ["status"],
                where: { student_id: studentId },
                _count: { status: true },
            }),
            prisma.booking.aggregate({
                where: {
                    student_id: studentId,
                    status: {
                        in: [BookingStatus.COMPLETED, BookingStatus.CONFIRMED],
                    },
                },
                _sum: { price: true },
            }),
            prisma.review.count({
                where: { student_id: studentId },
            }),
        ]);

    return {
        bookings: {
            total: totalBookings,
            byStatus: bookingsByStatus.reduce(
                (acc, item) => {
                    acc[item.status] = item._count.status;
                    return acc;
                },
                {} as Record<string, number>,
            ),
        },
        totalSpent: totalSpent._sum.price || 0,
        reviewsGiven,
    };
};

const getLandingPageStats = async () => {
    const [totalTutors, totalStudents, totalSessionsCompleted, totalSubjects] =
        await Promise.all([
            prisma.user.count({ where: { role: "TUTOR", status: "ACTIVE" } }),
            prisma.user.count({ where: { role: "STUDENT" } }),
            prisma.booking.count({
                where: { status: BookingStatus.COMPLETED },
            }),
            prisma.subject.count(),
        ]);
    return {
        totalTutors,
        totalStudents,
        totalSessionsCompleted,
        totalSubjects,
    };
};

export const dashboardService = {
    getAdminStats,
    getTutorStats,
    getStudentStats,
    getLandingPageStats,
};
