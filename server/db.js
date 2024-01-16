import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    return new PrismaClient();
};

globalThis.prisma = globalThis.prisma || prismaClientSingleton();

export default globalThis.prisma;
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
