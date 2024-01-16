import { NextResponse } from 'next/server';

const API_URL = "http://localhost:8080/api/services.json";

export const GET = async (req) => {
//  const list_services = await fetch(API_URL); 
 // console.log(list_services);


  const result = {
      services: [
      {
          id: 0,
    name: "github",
    api_url: "http://localhost:8080/api/github",
    img_url: "http://localhost:8080/api/github/github.webp",
    triggers: [
        {
            id: 0,
      name: "Ajouter un élément au readme du profile"
        },
        {
            id: 1,
      name: "Lorsqu'un commit est effectué sur un repository"
        },
        {
            id: 2,
      name: "Lorsqu'un repository est créé"
        },
        {
            id: 3,
      name: "Lorsque l'utilisateur crée un repository"
        }
    ]
      },
      {
    id: 1,
    name: "gmail",
    api_url: "http://localhost:8080/api/gmail",
    img_url: "http://localhost:8080/api/gmail/gmail.png",
    triggers: [
        {
            id: 0,
      name: "Lorsqu'un mail est reçu"
        },
        {
            id: 1,
      name: "Lorsqu'un mail est envoyé"
        }
    ]
      },
      {
    id: 2,
    name: "spotify",
    api_url: "http://localhost:8080/api/spotify",
    img_url: "http://localhost:8080/api/spotify/spotify.png",
    triggers: [
        {
            id: 0,
      name: "Liker une musique"
        },
        {
            id: 1,
      name: "Musique écoutée actuellement"
        },
        {
            id: 2,
      name: "Si la musique fait partie du top 3 des genres musicaux de l'utilisateur"
        }
    ]
      },
      {
    id: 3,
    name: "discord",
    api_url: "http://localhost:8080/api/discord",
    img_url: "http://localhost:8080/api/discord/discord.png",
    triggers: [
        {
            id: 0,
      name: "Envoyer un message sur un channel"
        },
        {
            id: 1,
      name: "Lorsque un channel est créee par l'utilisateur"
        },
        {
            id: 2,
      name: "Lorsque un channel est supprimé par l'utilisateur"
        },
    ]
      },
      {
    id: 4,
    name: "youtube",
    api_url: "http://localhost:8080/api/youtube",
    triggers: [
        {
            id: 0,
      name: "Lorsqu'une vidéo est aimée par l'utilisateur"
        },
    ]
      },
      {
    id: 5,
    name: "reddit",
    api_url: "http://localhost:8080/api/reddit",
    triggers: [
        {
            id: 0,
      name: "Lorsqu'un post est crée par l'utilisateur"
        }
    ]
      }
  ]
  };
  console.log(JSON.stringify(result, null, 2));
  return NextResponse.json(result);
}
