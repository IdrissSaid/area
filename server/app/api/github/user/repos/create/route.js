import { NextResponse } from 'next/server';

export const GET = async (req) => {
  const url = new URL(req.url);
  const access_token = url.searchParams.get("access_token");
  const repo_name = url.searchParams.get("name");
  const username = url.searchParams.get("username");

  console.log("username: " + username);
  console.log("access_token: " + access_token);
  console.log("Repository name: " + repo_name);
  const result = await fetch(`https://api.github.com/user/repos`, {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `token ${access_token}`,
      "X-Github-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      name: `${repo_name}`,
      description: "New Repo",
      homepage: "https://github.com",
      private: false,
    }),
  })
  .then((res) => res.json())
  .catch((error) => console.log(error));

  console.log(result);
  return NextResponse.json(result);
}
