import prisma from "../../../db";

export async function getProvider(sessionId, providerName) {
    if (!sessionId || !providerName)
        return
    const session = await prisma.session.findUnique({
        where: {
            id: sessionId,
        },
        include: {
            providers: true,
        },
    });

    if (!session) {
        console.log('Couldn\'t find session');
        return null;
    }

    const selectedProvider = session?.providers?.find(provider => provider.provider === providerName);

    if (!selectedProvider) {
        console.log(`Provider "${providerName}" not found in session`);
        return null;
    }

    console.log(selectedProvider);
    return selectedProvider;
}
