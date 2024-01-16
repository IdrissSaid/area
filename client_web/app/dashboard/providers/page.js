"use client"
import React, { useEffect, useState } from 'react';
import { useMySession } from '../../hooks/useSession';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function Providers() {
    const [user, setUser] = useState()
    const [providers, setProviders] = useState()
    useEffect( () => {
        const getServices = async () => {
        try {
            const { session } = await useMySession()
            if (!session)
                return
            let res = await fetch(`http://127.0.0.1:8080/api/session?session_id=${session}`,  {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });
            let data = await res.json()
            if (res.ok) {
                setUser({...data, session})
            }
            res = await fetch(`http://127.0.0.1:8080/api/service?session_id=${session}&type=service`,  {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });
            data = await res.json()
            if (res.ok) {
                setProviders({data, session})
            }
            } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            }
        }
        getServices()
    },  [])
    return (
        <div className=' w-full p-10 flex justify-center flex-col items-center'>
            <h1>Comptes Connectés</h1>
            { providers?.data?.map((provider, index) => {
                let connectedProvider = user?.providers?.filter(p => {
                    const PS = p.provider?.charAt(0).toUpperCase() + p.provider?.slice(1)
                    if ( PS === provider.service || (PS === "Google" && (provider.service === "Gmail" || provider.service === "Youtube")))
                        return p
                    return undefined
                })
                const pService = provider.service.charAt(0).toLowerCase() + provider.service.slice(1)
                return (
                    <div key={index}>
                        <h1>{ provider?.service} {connectedProvider.length > 0 ? <label>{connectedProvider[0]?.email}</label> :
                        <Link href={"#"} onClick={()=>signIn((pService == "gmail" || pService == "youtube") ? "google" : pService)}>Se connecter</Link>}</h1>
                    </div>
                )
            })}
        </div>
    )
}