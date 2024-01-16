'use client'
import React, { useState } from 'react';
import MyHeader from '../MyHeader';
import '../globals.css';
import Link from 'next/link'

export default function HomeLayout({ children }) {
  const [buttonColor, setButtonColor] = useState('white');
  const [buttonColor2, setButtonColor2] = useState('white');

  const handleButtonClick = () => {
    setButtonColor(buttonColor === 'white' ? '#D9D9D9' : '#D9D9D9');
    setButtonColor2('white');
  };

  const handleButtonClick2 = () => {
    setButtonColor2(buttonColor2 === 'white' ? '#D9D9D9' : '#D9D9D9');
    setButtonColor('white');
  };

  // if (navigation.pathname === '/dashboard') {
  //   setButtonColor('#D9D9D9');
  //   setButtonColor2('white');
  // } else if (navigation.pathname === '/dashboard/service') {
  //   setButtonColor2('#D9D9D9');
  //   setButtonColor('white');
  // }

  return (
    <div className=' h-full w-full'>
      <MyHeader />
      <div style={{ display: 'flex', justifyContent: 'space-between', height: '8%'}}>
        <Link href="/dashboard" style={{ ...styles.button, color: 'black', backgroundColor: buttonColor }} onClick={handleButtonClick}>
          <button>Crée un service</button>
        </Link>
        <Link href="/dashboard/service" style={{ ...styles.button, color: 'black', backgroundColor: buttonColor2 }} onClick={handleButtonClick2}>
          <button>Mes services</button>
        </Link>
      </div>
      {children}
    </div>
  );
}


const styles = {
  button: {
    display: 'flex',
    width: '50%',
    justifyContent: 'center',
    border: '1px',
    borderColor: 'black',
    borderStyle: 'solid',
    color: 'black',
  },
}