import type { Availability } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createAvailability = async (payloads: Availability[]) => {
    console.log("createAvailability", payloads);
    return await prisma.availability.createManyAndReturn({ data: payloads });
};

const getAllAvailability = async () => {
    return await prisma.availability.findMany();
};

export const availabilityService = { createAvailability, getAllAvailability };
