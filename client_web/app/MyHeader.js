"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { useMySession } from './hooks/useSession';
import { signIn, signOut } from 'next-auth/react';
import { logout } from './logout';

function Connection() {
  const [user, setUser] = useState()
  useEffect( () => {
    const getServices = async () => {
      try {
        const { session, back } = await useMySession()
        if (!session)
          return
        const res = await fetch(`${back}/api/session?session_id=${session}`,  {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json()
        if (res.ok) {
          setUser({...data, session})
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }
    getServices()
  },  [])

  if (!user?.session) {
    return (
      <div>
        <Link className=' px-4 py-1 border-1 rounded-lg border-black text-black border-solid' href="/login">Se Connecter</Link>
        <Link className=' px-4 py-1 border-1 rounded-lg border-black text-black border-solid' href="/signUp">S'inscrire</Link>
      </div>
    )
  }
  return (
    <div>
      <h1>Connecté avec {user?.providers[user?.providers?.length - 1]?.profile?.name || user?.providers[0]?.email}</h1>
      <Link className=' px-4 py-1 border-1 rounded-lg border-black text-black border-solid' onClick={async () => {
        signOut();
        await logout()
      }} href="#">Se Déconnecter</Link>
      <Link className=' px-4 py-1 border-1 rounded-lg border-black text-black border-solid' href={"/dashboard/providers"}>Lier un compte</Link>
    </div>
  )
}

export default function MyHeader() {
  return (
    <header style={{ background: 'white',textAlign: 'center' }}>
      <div className=' gap-20' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{display: 'flex', justifyContent:'flex-start' }}>
          <Image src="/logo_BEREB.png" width={100} height={100} />
        </div>
        <Link  className=' px-4 py-1 border-1 rounded-lg border-black text-black border-solid' href="/dashboard">Home</Link>
        <Link  className=' px-4 py-1 border-1 rounded-lg border-black text-black border-solid' href="/dashboard/service">Service</Link>
        <Connection />
      </div>
    </header>
  );
}

const styles = {
  square: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    border: '1px',
    borderColor: 'black',
    borderStyle: 'solid',
    color: 'black',
    borderRadius: '0.4em',
    margin: 'auto',
    alignItems: 'center',
  },
}