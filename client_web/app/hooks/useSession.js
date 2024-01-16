"use server"
// import { useSession } from 'next-auth/react';
import { cookies } from 'next/headers'

export async function useMySession() {
    const s = cookies().get('session')?.value;
    // const { data: user, status } = useSession();
    return {session: s}
}