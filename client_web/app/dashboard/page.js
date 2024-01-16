'use client'
import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMySession } from '../hooks/useSession';

const Dropdown = ({drop, onChange}) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    onChange(event.target.value)
  };
  return (
    <div>
      <select id="dropdown" value={selectedOption} onChange={handleSelectChange}>
        <option value="">Séléctionnez sa fonctionnalité</option>
        {
          drop?.map((item, index) => {
            return (<option className='text-center' key={index}>{item.label}</option>)
          })
        }
      </select>
    </div>
  );
};

// function DisplayService({ service}) {
//   const [cibles, setCibles] = useState([])
//   const router  = useRouter()
//   useEffect( () => {
//     const getCibles = async () => {
//       try {
//         const res = await fetch("http://127.0.0.1:8080/api/service?type=cible",  {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         const data = await res.json()
//         if (res.ok) {
//           setCibles(data)
//         }
//       console.log(data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des données:', error);
//       }
//     }
//     getCibles()
//   },  [])
//   const [cible, setCible] = useState(0)

  // const handleForm = async () => {
  //   if (!service || !cibles[cible]) {
  //     return
  //   }
  //   const res = await fetch("http://127.0.0.1:8080/api/service/saved", {
  //     method: "POST",
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       cible: cibles[cible],
  //       service: service,
  //       type: "save"
  //     })
  //   })
  //   if (res.ok)
  //     router.push("/dashboard/service")
  // }
//   return (
//     <div style={{height: '100%', width: '100%'}}>
//       <div style={{...styles.MyService}}>
//         <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'center'}}>
//         <div><h1 style={{padding: '0.2em', fontSize: '1.3em'}}>Choisissez votre cible</h1></div>
//         <div>
//           <ShowServices onClick={(index) => setCible(index)} services={cibles} />
//         </div>
//         <div>
//           <div style={{display:'flex', justifyContent: 'center', fontSize: '1.2em'}}><h1>Vous avez choisi <span style={{ fontWeight: 'bold' }}>{cibles[cible]?.service}</span> comme cible</h1></div>
//         </div>
//           <img src={cibles[cible]?.src} style={{ width: '5%', height: '20%'}} alt={cibles[cible]?.src}/>
//           <h1 >{cibles[cible]?.service}</h1>
//           <div style={{padding:'1em'}}><Dropdown drop={cibles[cible]?.drop}/></div>
//         </div>
//         <div style={{...styles.valid, backgroundColor: '#416BD8', display: 'flex'}}>
//           <button onClick={handleForm}> <h1>Valider</h1></button>
//         </div>
//       </div>
//     </div>
//   );
// }

function ShowServices({type, onChange}) {
  const [services, setServices] = useState()
  const [service, setService] = useState(0)
  const [user, setUser] = useState()

  useEffect( () => {
    const getServices = async () => {
      try {
        const { session, back } = await useMySession()
        if (!session)
          return
        let res = await fetch(`${back}/api/service?type=${type}&session_id=${session}`);
        let data = await res?.json()
        if (res?.ok) {
          setServices(data)
        }
        res = await fetch(`${back}/api/session?session_id=${session}`,  {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        });
        let userdata = await res.json()
        if (res.ok) {
            setUser(userdata)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }
    getServices()
  },  [])

  const handleService = (index) => {
    setService(index)
  }

  const handleDrop = (data) => {
    onChange({service: services[service], drop: data})
  }

  if (services == undefined)
    return (<div style={{ alignItems: 'center', display: 'flex', justifyContent: "center" }}><h1>Chargement des données...</h1></div>)

  return (
    <div className=' p-4 gap-10 flex flex-col items-center'>
      <h1 style={{fontWeight: 'bold', fontSize: '1.5em'}}>{type?.charAt(0).toUpperCase() + type.slice(1)}</h1>
      <div className='gap-20 justify-center items-center overflow-scroll p-4' style={{display: 'flex', flexDirection: 'row', height: '100%', width:'100%'}}>
        {services?.map((item, index)=> {
          let connectedProvider = user?.providers?.filter(p => p.provider?.charAt(0).toUpperCase() + p.provider?.slice(1) === item.service);
          if (connectedProvider?.length > 0)
            return (
              <div key={index} className='flex justify-center items-center flex-col'>
                <button onClick={() => handleService(index)}>
                  <Image alr={item.service} alt={item.service} style={{objectFit: "contain"}} src={item.src} width={40} height={30} />
                </button>
                <h5>{item.service}</h5>
              </div>
            )
        })}
      </div>
      <div className='flex flex-col justify-center items-center'>
        <h1 className=' p-5'>Vous avez choisi <span style={{ fontWeight: 'bold' }}>{services[service]?.service}</span> comme {type}</h1>
        <Image src={services[service]?.src} style={{objectFit: "contain"}} alt={services[service]?.service} width={40} height={30} />
        <h1 >{services[service]?.service}</h1>
        <div style={{padding: '1em'}}>
          <Dropdown onChange={handleDrop} drop={services[service]?.drop}/>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [serviceSelected, setServiceSelected] = useState({})
  const [cibleSelected, setCibleSelected] = useState({})
  const router  = useRouter()

  const handleForm = async () => {
    const { session } = await useMySession()
    console.log(session)
    if (!serviceSelected || !cibleSelected || !session) {
      return
    }
    const res = await fetch(`http://127.0.0.1:8080/api/service/saved`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cible: cibleSelected.service,
        cibleOption: cibleSelected.drop,
        service: serviceSelected.service,
        serviceOption: serviceSelected.drop,
        session_id: session,
      })
    })
    if (res.ok)
      router.push("/dashboard/service")
  }

  const handleChangeServie = (data) => {
    setServiceSelected(data)
  }

  const handleChangeCible = (data) => {
    setCibleSelected(data)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#292F36'}}>
      <div className='gap-5 py-11' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#292F36', width: '100%'}}>
          <h1 style={{fontWeight: 'bold', fontSize: '1.5em'}}>Choisissez votre service à automatiser</h1>
          <h1>Connectez vos services rapidement</h1>
      </div>
      <div className=' border-black border-1 rounded-lg py-4' style={{ width:'60%' }}>
        <ShowServices onChange={handleChangeServie} type={"service"}/>
        <ShowServices onChange={handleChangeCible} type={"cible"}/>
        <div style={{...styles.valid, backgroundColor: '#416BD8', display: 'flex'}}>
          <button onClick={handleForm}> <h1>Valider</h1></button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  MyService: {
    padding: '1em',
    height: '100%',
    width: '65%',
    justifyContent: 'center',
    border: '1px',
    borderColor: 'black',
    borderStyle: 'solid',
    color: 'black',
    borderRadius: '1em',
    margin: 'auto',
    alignItems: 'center',
  },
  MyDropdown: {
    backgroundColor: '#ccc',
    marginLeft: 50,
    padding: '8px',
    borderRadius: '4px',
    marginTop: 20,
  },
  valid: {
    height: '5%',
    width: '30%',
    justifyContent: 'center',
    borderRadius: '1em',
    padding: '1em',
    margin: 'auto',
    alignItems: 'center',
    color: 'white',
  }
};
