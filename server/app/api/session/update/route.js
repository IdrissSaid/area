import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../db"
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt'

async function saveInSql(r)
{
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_DATABASE,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE_NAME,
            port: process.env.MYSQL_PORT,
        });

        const [result] = await connection.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
            r.user?.email,
            r.user?.email,
            r.user?.password
        ]);

        await connection.end();
        return result.insertId;
    } catch (error) {
        console.error("Error SQL creating record in the database:", error);
        return undefined
    }
}

async function getInSql(r)
{
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE_NAME,
        port: process.env.MYSQL_PORT,
    });

    const [result] = await connection.execute('SELECT * FROM users WHERE email = ?', [r.user?.email]);

    await connection.end();
    if (result.length > 0) {
        const user = result[0];
        const passwordMatch = await bcrypt.compare(r.user?.password, user.password);
        if (passwordMatch) {
            return {auth: user, status: 202};
        } else {
            console.log('Password mismatch');
            return {status: 401, error: "Email ou Mot de passe invalide"};
        }
    }
    return {auth: null, status: 202};
}

async function saveInMongo(r, user, id_session)
{
    try {
        console.log("User ", r.user)
        const id = await prisma.auth.create({
            data: {
                provider: r.user?.provider,
                email: r.user?.email,
                profile: {
                    name: r.user?.name,
                    photo: r.user?.picture,
                    id: user
                },
                credential: {
                    access_token: r.account?.access_token,
                    refresh_token: r.account?.refresh_token,
                    token_type: r.account?.token_type,
                    expiry_data: r.account?.expires_data,
                },
                sessionId: id_session,
            }
        }).then(data => data.id);

        console.log("Successfully created ", id);

        return new NextResponse(JSON.stringify({id: id, id_session: id_session}), { status: 200 });
    } catch (error) {
        console.error("Error Mongo creating record in the database:", error.message);
        return new NextResponse(JSON.stringify({ error:  error.message }), { status: 402 });
    }
}

async function getInMongo(email, provider)
{
    try {
        const data = await prisma.auth.findMany({
            where: {
                provider: provider,
                email: email,
            }
        })
        if (data.length > 0) {
            return { data: data[0], status: 200 };
        } else {
            return { status: 404, error: "Data not found" };
        }
    } catch (error) {
        console.error("Error Mongo creating record in the database:", error.message);
        return {status: 402, error: error.message}
    }
}

export async function POST(req, res)
{
    const r = await req?.json();
    let user = -1
    let id_session
    if (!r)
        return new NextResponse(null, { status: 402, statusText: "no provider or profile or credential" });
    if (r.user?.provider === "own") {
        const {auth, status, error} = await getInSql(r)
        if (status !== 202)
            return new NextResponse(JSON.stringify({ error:  error }), { status: status });
        if (!r?.session && auth == null) {
            console.log("own not found: ", r.user)
            user = await saveInSql(r)
            if (user == undefined)
                return new NextResponse(JSON.stringify({ error:  "error" }), { status: 402 });
        }
    }
    if (user == -1 && !r.user?.provider)
        return new NextResponse(JSON.stringify({ error:  "User == -1" }), { status: 202 });
    const {data, status, error} = await getInMongo(r.user?.email, r.user?.provider)
    if (status === 402)
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 402 });
    else if (status == 404 && !r?.session) {
        console.log("not found")
        id_session = await prisma.session.create({data:{}}).then(data => data.id)
    } else if (data) {
        console.log("founded")
        return new NextResponse(JSON.stringify({id_session: data?.sessionId}), { status: 200 });
    } else
        id_session = r?.session
    return await saveInMongo(r, user, id_session)
}
