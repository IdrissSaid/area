'use client'
import React, { useEffect, useState } from "react";
import { useMySession } from '../../hooks/useSession';

export default function service() {
  const [savedServices, setSavedServices] = useState()
  useEffect( () => {
      const getSavedServices = async () => {
        try {
          const { session, back } = await useMySession()
          if (!session)
            return
          const res = await fetch(`${back}/api/service/saved?session_id=${session}`,  {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await res.json()
          if (res.ok) {
            setSavedServices(data)
            console.log(data);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
        }
      }
      getSavedServices()
    },  [])
    if (!savedServices)
      return (<div style={{ alignItems: 'center', display: 'flex', justifyContent: "center" }}><h1>Chargement des données...</h1></div>)

    return (
        <div style={{height: '100%', width: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'column'}}>
            <div style={{height: '15%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'end'}}>
                <h1 style={{fontFamily: 'DM Serif Display', fontSize: '2em', color: '#292F36', fontWeight: 'bold'}}>Mes services</h1>
            </div>
            <div style={{height: '65%', width: '100%', display: 'flex', flexDirection: 'column', gap: '1em', overflowY: 'scroll'}}>
                {
                    savedServices.map((item, index) => {
                        return(
                <div style={styles.MyService} key={index}>
                    <div style={{alignItems: 'center', display: 'flex'}}>
                        <div style={{justifyItems: 'center', display: 'flex', flexDirection: 'column'}}>
                            <img src={item.service.src} style={{ width: '40%', height: '40%' }} />
                            <h1>{item.service.drop[0].label}</h1>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <h1>Lier à </h1>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                            <img src={item.cible.src} style={{ width: '40%', height: '40%' }} />
                            <h1>{item.cible.drop[0].label}</h1>
                        </div>
                    </div>
                    {/* <div style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'end'}}>
                        <button style={styles.valid}>Modifier</button>
                    </div> */}
                </div>
                    )
                })
            }
            </div>
        </div>
    )
};

const styles = {
    MyService: {
        padding: '1em',
        height: '70%',
        width: '40%',
        border: '1px',
        borderColor: 'black',
        borderStyle: 'solid',
        color: 'black',
        borderRadius: '1em',
        margin: 'auto',
      },
      valid: {
        height:'10%',
        width: '30%',
        fontFamily: 'DM Serif Display',
        backgroundColor: '#FF0000',
        justifyContent: 'center',
        fontSize: '1em',
        borderRadius: '1em',
        display: 'flex',
        color: 'white',
        alignItems: 'center',
        fontSize: '1.2em'
      }
}