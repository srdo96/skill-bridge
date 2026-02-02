import type { Booking } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createBooking = async (payload: Booking) => {
    return await prisma.booking.create({
        data: payload,
    });
};

export const bookingService = { createBooking };
