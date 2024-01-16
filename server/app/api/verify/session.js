import prisma from "../../../db"

export async function verifySession(session) {
    if (!session)
        return false;
    try {
        const result = await prisma.session.count({
            where: {
                id: session
            }
        });
        return (!result) ? false : true;
    } catch (error) {
        console.error("Error verifying session:", error);
        return false;
    }
}
