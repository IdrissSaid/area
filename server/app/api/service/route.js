import { NextRequest, NextResponse } from 'next/server'
import prisma from "../../../db"
import { verifySession } from "../verify/session"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const sessionsId = searchParams.get('session_id');

    if (await verifySession(sessionsId) == false)
      return new Response("Aucune Session trouvé", { status: 401 });

    let res;

    if (type) {
      res = await prisma?.service?.findMany({
        where: {
          type: type
        }
      });
    } else {
      res = await prisma?.service?.findMany();
    }

    return new Response(JSON.stringify(res));
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json()

  if (await verifySession(body.session_id) == false)
    return new Response("Aucune Session trouvé", { status: 401 });

  const res = await prisma?.service.create({
    data: {
      service: body.service,
      src: body.src,
      drop: body.drop,
      type: body.type
    }
  })
  return NextResponse.json(res)
}