import { BookingStatus, type Booking } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createBooking = async (payload: Booking) => {
    const hourlyRate = await prisma.tutorProfile.findUniqueOrThrow({
        where: { tutor_profile_id: payload.tutor_profile_id },
        select: { hourly_rate: true },
    });
    const minRate = Number(hourlyRate.hourly_rate) / 60;
    const endTimeSplit = payload.end_time.split(":");
    const endTimeMin = Number(endTimeSplit[0]) * 60 + Number(endTimeSplit[1]);
    const startTimeSplit = payload.start_time.split(":");
    const startTimeMin =
        Number(startTimeSplit[0]) * 60 + Number(startTimeSplit[1]);
    const durationMin = endTimeMin - startTimeMin;
    const price = minRate * durationMin;

    return await prisma.booking.create({
        data: {
            ...payload,
            price: price,
        },
    });
};

const getBookingsByUserId = async (userId: string) => {
    return await prisma.booking.findMany({
        where: {
            OR: [
                { student_id: userId },
                { tutorProfile: { tutor_id: userId } },
            ],
        },
        omit: { subject_id: true, tutor_profile_id: true, student_id: true },
        include: {
            subject: true,
            tutorProfile: true,
            student: true,
        },
    });
};

const getAllBookings = async (
    page: number,
    limit: number,
    skip: number,
    userId?: string,
) => {
    const where = userId
        ? {
              OR: [{ student_id: userId }, { tutor_profile_id: userId }],
          }
        : undefined;

    const [total, bookings] = await Promise.all([
        prisma.booking.count({
            ...(where ? { where } : {}),
        }),
        prisma.booking.findMany({
            ...(where ? { where } : {}),
            orderBy: { created_at: "desc" },
            skip,
            take: limit,
            include: {
                subject: true,
                tutorProfile: true,
                student: true,
            },
        }),
    ]);
    return {
        total,
        page,
        limit,
        bookings,
        totalPages: Math.ceil(total / limit),
    };
};

const getBookingDetails = async (bookingId: string) => {
    console.log(bookingId);
    return await prisma.booking.findUniqueOrThrow({
        where: { booking_id: bookingId },
        include: {
            tutorProfile: {
                include: {
                    tutor: true,
                },
            },
            subject: true,
            student: true,
            reviews: true,
        },
    });
};

const cancelBooking = async (bookingId: string) => {
    return await prisma.booking.update({
        where: { booking_id: bookingId },
        data: { status: BookingStatus.CANCELLED },
    });
};

export const bookingService = {
    createBooking,
    getBookingsByUserId,
    getAllBookings,
    getBookingDetails,
    cancelBooking,
};
