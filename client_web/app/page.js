'use client';
import React from 'react';
import MyHeader from './MyHeader';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ height: '100%', width: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
      <MyHeader />
      <div style={{  justifyContent: 'center', display: 'flex' }}>
        <Image src="/service.png" height={80} width={1050} style={{objectFit: "contain"}} alt="Service Image" />
      </div>
      <div className='p-6'>
        <div style={{  justifyContent: 'center', display: 'flex', width: '23%', padding: '1em' }}>
          <h1 style={styles.servicesHeading}>Les services</h1>
        </div>
        <div className='flex justify-center content-center'>
          <div style={{  width: '35%', alignItems: 'center', display: 'flex', flexDirection: 'column', color: 'black', padding: '0.6em'}}>
            <h1>Bereb :<br/>Votre passerelle unifiée pour connecter,<br/>simplifier et dynamiser votre monde numérique !</h1>
          </div>
          <div className='flex w-2/3 justify-center items-center gap-20'>
              <Image placeholder="blur" alt='Logo Gmail' style={{objectFit: "contain"}} blurDataURL="data:/gmail.png" src="/gmail.png" height={40} width={70}/>
              <Image placeholder="blur" alt='Logo Spotify' style={{objectFit: "contain"}} blurDataURL="data:/spotify.png" src="/spotify.png" height={40} width={70}/>
              <Image placeholder="blur" alt='Logo Discord' style={{objectFit: "contain"}} blurDataURL="data:/discord.png" src="/discord.png" height={40} width={70}/>
              <Image placeholder="blur" alt='Logo Youtube' style={{objectFit: "contain"}} blurDataURL="data:/youtube.png" src="/youtube.png" height={40} width={70}/>
              <Link href={'/dashboard'} style={styles.start}>Commencer</Link>
          </div>
        </div>
      </div>
      <div className=' p-4' style={{ justifyContent: 'center', display: 'flex', color: 'black', backgroundColor: 'pink' }}>
        <h1 style={styles.servicesHeading}>Simple & efficace</h1>
      </div>
      <div className='flex items-center justify-center gap-20 text-black p-4'>
        <Image alt="Image de fond" src= "/connect.png" width={400} height={100} style={{objectFit: "contain"}}/>
        <h1 className=' '>En utilisant Bereb,<br/>Les utilisateurs peuvent profiter d'une expérience sans couture<br/>Réduisant le besoin de jongler entre différents outils et plateforme<br/>Ce qui rend non seulement le travail plus rapide<br/>mais aussi plus agréable.</h1>
      </div>
    </div>
  );
}

const styles = {
  start: {
    height: '5%',
    width: '15%',
    justifyContent: 'center',
    borderRadius: '1em',
    padding: '1em',
    alignItems: 'center',
    backgroundColor: '#EEC8C8',
    color: 'black',
    display: 'flex',
  },
  servicesHeading: {
    color: 'black',
    textAlign: 'center',
    fontSize: '2em',
    textDecoration: 'underline',
  }
};
