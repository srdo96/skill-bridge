import type { Availability } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createAvailability = async (payloads: Availability[]) => {
    console.log("createAvailability", payloads);
    return await prisma.availability.createManyAndReturn({ data: payloads });
};

const getAllAvailability = async () => {
    return await prisma.availability.findMany();
};

const deleteAvailabilityById = async (availabilityId: string) => {
    return await prisma.availability.delete({
        where: { availability_id: availabilityId },
    });
};

export const availabilityService = {
    createAvailability,
    getAllAvailability,
    deleteAvailabilityById,
};
