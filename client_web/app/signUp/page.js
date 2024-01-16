'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div style={{backgroundColor: 'white', height: '100%', width: '100%'}}>
      <div style={{ height: '100%', width: '100%', justifyContent: 'center', display: 'flex', fontFamily: 'DM Serif Display'}}>
          <div style={styles.board}>
            <div style={{}}>
              <Image src="/logo_BEREB.png" width={100} height={100} />
            </div>
            <div style={{ justifyContent: 'center', display: 'flex', padding: '2em'}}>
              <h1 style={{ color: '#292F36', fontSize: '1.5em', fontWeight: 'bold' }}>Créer un compte</h1>
            </div>
            <div style={{ height: '100%',  padding: '1.5em'}}>
              <div style={{flexDirection: 'column', display: 'flex',  height: '40%', justifyContent: 'center'}}>
                <label htmlFor="email" style={{ color: 'black', justifyContent: 'center', display: 'flex', fontSize: '1.2em' }}>E-mail:</label>
                <div style={{ justifyContent: 'center', display: 'flex', padding: '1em'}}>
                  <input type="email" id="email" value={email} onChange={handleEmailChange} style={styles.Myborder} />
                </div>
              <div style={{flexDirection: 'column', display: 'flex',  height: '20%', justifyContent: 'center'}}>
                <label htmlFor="password" style={{ color: 'black',  justifyContent: 'center', display: 'flex',  padding: '1em', fontFamily: 'DM Serif Display',fontSize: '1.2em' }}>Mot de passe:</label>
                <div style={{  justifyContent: 'center', display: 'flex'}}>
                  <input type="password" id="password" value={password} onChange={handlePasswordChange} style={styles.Myborder} />
                </div>
              </div>
              <div className='w-full flex justify-center p-5'>
                  <button style={styles.valid} onClick={async () => {
                    const res = await signIn('credentials', {email, password})
                    if (res.error) {
                      setError("Invalid credentials")
                      return
                    }
                  }}>S'inscrire</button>
              </div>
            </div>
            <div style={{color: 'black', justifyContent: 'center', display: 'flex', padding: '2em', fontSize: '1.2em'}}>
              <h1>ou</h1>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '-1.5em'}}>
              <button type="button" style={{...styles.googleButton}}>
                <Image src="/google.png" alt="Google Icon" width={25} height={25} style={{ marginRight: '1em', backgroundColor: 'white', borderRadius: '0.1em' }} />
                Se Connecter avec Google
              </button>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '1em'}}>
              <button type="button" style={{...styles.facebookButton}}>
                <Image src="/facebook.jpg" alt="Facebook Icon" width={25} height={25} style={{ marginRight: '1em', backgroundColor: 'white', borderRadius: '0.1em' }} />
                Se Connecter avec Facebook
              </button>
            </div>
            <div style={{ justifyContent: 'center', display: 'flex', padding: '0.5em' }}>
              <h1 style={{ color: 'black', marginLeft: '0.5em', marginRight: '1em' }}>Vous n'avez pas de compte ?</h1>
              <Link href={'/login'} style={{color: 'blue'}}>
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  board: {
    height: '80%',
    width: '40%',
    justifyContent: 'center',
    border: '1px solid black',
    borderRadius: '1em',
    margin: 'auto',
    alignItems: 'center',
  },
  Myborder: {
    display: 'flex',
    width: '30%',
    border: '1px solid black',
    borderRadius: '0.5em',
    padding: '0.5em',
    color: 'black',
    justifyContent: 'center'
  },
  valid: {
    height:'100%',
    width: '30%',
    backgroundColor: '#292F36',
    justifyContent: 'center',
    borderRadius: '1em',
    display: 'flex',
    color: 'white',
    alignItems: 'center',
    fontSize: '1.2em'
  },
  googleButton: {
    display: 'flex',
    height: '30px',
    width: '40%',
    backgroundColor: '#4285f4',
    borderRadius: '4px',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2em',
    cursor: 'pointer',
    border: '1px solid #4285f4',
    color: 'white',
  },
  facebookButton: {
    display: 'flex',
    height: '30px',
    width: '40%',
    backgroundColor: '#4267B2',
    borderRadius: '4px',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2em',
    cursor: 'pointer',
    border: '1px solid #4267B2',
    color: 'white',
  }
};
