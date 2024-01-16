import { NextResponse } from 'next/server';
import prisma from "../../../db"
import { getProvider } from '../session/getProvider'

export async function GET() {
    const res = await prisma.serviceSaved.findMany({
        include: {
            service: true,
            cible: true,
        }
    })
    if (!res)
        return NextResponse.json({ ok: true, message: "No data" });
    res.forEach( async (element) => {
        let session = await prisma.session.findMany({ sessionId: element.sessionId })[0];
        if (!session) return;
        const service = res.service.drop.filtre(item => item.label === element.serviceOption);
        const cible = res.cible.drop.filtre(item => item.label === element.cibleOption);

        const serviceProvider = getProvider(session, service.service)
        const cibleProvider = getProvider(session, cible.service)

        if (!serviceProvider || !cibleProvider) {
            return 401;
        }

        const serviceRes = fetch(service?.url, {
            method: service.method,
            body: {
                access_token: serviceProvider.credential.access_token
            }
        })
        const cibleRes = fetch(cible?.url, {
            method: cible.method,
            body: {
                access_token: serviceProvider.credential.access_token
            }
        })
    });
    return NextResponse.json({ ok: true });
}