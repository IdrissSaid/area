import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const { to, subject, text } = await req.json();
  let res = new NextResponse();

  if (to === undefined || subject === undefined || text === undefined) {
    return NextResponse.error('Missing to, subject, or text in the request body', 500);
  }

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.gmail,
      pass: process.env.gmail_password,
    },
  });

  try {
    const mailOptions = {
      from: process.env.gmail,
      to: to,
      subject: subject,
      text: text,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.error('Failed to send email', 500);
  }
	console.log("ok")
  return NextResponse.json({ message: 'Email sent' }, res);
}
