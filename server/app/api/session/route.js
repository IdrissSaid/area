import { NextResponse } from "next/server";
import prisma from "../../../db";
import { verifySession } from "../verify/session"

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (await verifySession(sessionId) == false)
        return new Response("Aucune Session trouvé", { status: 401 });

    const res = await prisma.session.findUnique({
        where: {
            id: sessionId,
        },
        include: {
            providers: true,
            servicesSaved: true,
        }
    });
    if (!res) {
        return new Response("Session not found", { status: 404 });
    }
    return NextResponse.json(res, { status: 200 });
}
