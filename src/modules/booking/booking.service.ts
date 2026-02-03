import { BookingStatus, type Booking } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createBooking = async (payload: Booking) => {
    console.log("payload", payload);
    return await prisma.booking.create({
        data: payload,
    });
};

const getBookings = async (userId: string) => {
    return await prisma.booking.findMany({
        where: {
            student_id: userId,
        },
        omit: { subject_id: true, tutor_profile_id: true, student_id: true },
        include: {
            subject: true,
            tutorProfile: true,
            student: true,
        },
    });
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
    getBookings,
    getBookingDetails,
    cancelBooking,
};
