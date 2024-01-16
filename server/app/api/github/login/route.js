import { NextResponse } from 'next/server';

const GITHUB_URL = 'https://github.com/login/oauth/authorize';

export const GET = async () => {
  var params = "?";
  const scopes = ["repo", "user"]

  params += "client_id=" + process.env.GITHUB_CLIENT_ID;
  params += "&scope="
  params += scopes.join("%20");
  return NextResponse.redirect(GITHUB_URL + params);
}
