import type { Booking } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createBooking = async (payload: Booking) => {
    console.log("payload", payload);
    return await prisma.booking.create({
        data: payload,
    });
};

export const bookingService = { createBooking };
