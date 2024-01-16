import { NextResponse } from 'next/server';
import {DISCORD_TOKEN, getIDWithName} from "../../../discord/utils";

const createAPost = async (accessToken, subreddit, title, content) => {
  try {
    const res = await fetch(`https://oauth.reddit.com/api/submit?sr=${subreddit}&kind=self&resubmit=true&send_replies=true&title=${title}&text=${content}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        title: title,
        text: content
      })
    })
    .then(res => {
      return {
        status: res.status,
        statusText: res.statusText,
        title: title,
        content: content,
        subreddit: subreddit
      }
    })
    .catch(err => console.error(err));
    return res;
  } catch (error) {
    console.error("ERORR")
  }
}

export const GET = async (req) => {
    try {
        const url = new URL(req.url);
        const subr = url.searchParams.get("subr");
        const title = url.searchParams.get("title");
        const content = "A recup plus tard dans la base de donnée chp comment";
        const accessT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzA1MzIzODYxLjE1NzYxMywiaWF0IjoxNzA1MjM3NDYxLjE1NzYxMywianRpIjoib3dRZXB1M0U4U1N4Q3o0X2tLN0kwVVBhVzJLU0xnIiwiY2lkIjoicFNNeXRwcEtyd0J2LVhIUVllNHhTUSIsImxpZCI6InQyX3MxenR6OXNuZyIsImFpZCI6InQyX3MxenR6OXNuZyIsImxjYSI6MTcwNTIzNDQ5OTg0Mywic2NwIjoiZUp5S1ZrcE1UczR2elN0UjBsRXFMazNLelFReE1sTlM4MG95U3lxVllnRUJBQURfXzZvLUNzZyIsInJjaWQiOiJMeW80UTZCTDNuNG9TRk5hbnlHd3RnRW01dGdEN0lhNDlyZ3ktVGM4SEhVIiwiZmxvIjo4fQ.hpNh7SxvRJ9tzNaayN7Y4yRoNK_rPIvS_Tm0YaTPAMOh8n_8nvd2-rTPEQg9ytTPxtXEh4ik6Z_laeCuY92q6Lz8OZYTuFwMHHq04K1X5RJzMfQ2lzBVg2uozO02mTaAuOgEQ7vnWcHGFViBhUk2yHvRIzZzNpYCrURn2wnFstObJjJS4k7w9mhNm0N2c3AVEhbFv0JtOOAb5bE7WrSTvZywWx3ZlG-vZh45d2rTvddAPSYRz9VV4fBh2TVQAF74c9-hoCQIxIPO4T4-vbo1qhqKEYgZ2vUYej9QkU3KevtxOeZEpseozVLxbAUsaJCmX8MepQAxxmnl99EeVtixsQ"

        const result = await createAPost(accessT, subr, title, content);
        
        console.log(JSON.stringify(result, null, 2));
        return NextResponse.json(result);
    } catch (error) {
        return Response.json({error});
    }
}
