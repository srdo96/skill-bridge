import type { Booking } from "../../../generated/prisma/client";
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

export const bookingService = { createBooking, getBookings };
