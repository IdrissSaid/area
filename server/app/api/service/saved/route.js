import { NextRequest, NextResponse } from 'next/server'
import prisma from "../../../../db"
import { verifySession } from "../../verify/session"

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (await verifySession(sessionId) == false)
    return new Response("Aucune Session trouvé", { status: 401 });

  const res = await prisma.serviceSaved.findMany({
      where: {
        sessionId: sessionId
      },
      include: {
          service: true,
          cible: true,
      }
  });
  return new Response(JSON.stringify(res))
}

export async function POST(request) {
  const body = await request.json()

  if (await verifySession(body?.session_id) == false)
    return new Response("Aucune Session trouvé", { status: 401 });

    const res = await prisma.serviceSaved.create({
      data: {
        serviceId: body?.service?.id,
        serviceOption: body?.serviceOption,
        cibleId: body?.cible?.id,
        cibleOption: body?.cibleOption,
        sessionId: body?.session_id,
      }
    })
  return NextResponse.json(res)
}