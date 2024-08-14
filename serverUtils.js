"use server";
const { SignJWT, jwtVerify } = require("jose");
const { cookies } = require("next/headers");
const { parse } = require("cookie");
const dotenv=require('dotenv');
const fs = require('fs');
const path = require('path');
const url = require('url');
const axios = require('axios');
const { NextRequest, NextResponse } = require("next/server");


// const { readParticipantsData } = require("../server/resultdb-manager");

dotenv.config();

const secretKey = "IntekhaabPurAman";
const key = new TextEncoder().encode(secretKey);

async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key);
}

async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}
async function readParticipantsData() {
  const databasePath = process.env.PARTICIPANTS_DATABASE_PATH;
  const parsedUrl = url.parse(databasePath);

  let participantsData;

  if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
    // Fetch data from URL
    const response = await axios.get(databasePath);
    participantsData = response.data;
  } else {
    // Read data from file system
    const filePath = path.resolve(databasePath);
    const fileData = fs.readFileSync(filePath, 'utf-8');
    participantsData = JSON.parse(fileData);
  }

  console.log(participantsData.participants);
  return participantsData.participants;
}


async function login(req, res, user) {
  const users = await readParticipantsData();
  const { username, password } = user;
  // const isValidUser = users.some((user) => user.username === username && user.password === password);
  // const isApproved = users.some((user) => user.username === username && user.password === password && user.approved === true);
  // console.log(isValidUser); 
  // console.log(isApproved);
  isValidUser = false;
  isApproved = false;

  if (!isValidUser) {
    return null;
  }
  if (isValidUser && !isApproved) {
    console.log("Get Approved");
    return "Get Approved";
  }

  const expires = new Date(Date.now() + 20 * 60 * 1000);
  const session = await encrypt({ user, expires });

  res.setHeader('Set-Cookie', `session=${session}; Expires=${expires.toUTCString()}; HttpOnly; Path=/`);
}

async function logout(req, res) {
return await updateSession(req);
}




async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

async function getSessionAPI(req) {
// console.log(req);
  if (!req || !req.headers) return null;

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = parse(cookieHeader);
  console.log(cookies);

  const session = cookies.session;
  if (!session) return null;
  return await decrypt(session);
}

// async function updateSession(request,res) {
//   const cookieHeader = request.headers.session;
//   if (!cookieHeader) return;
//   console.log(cookieHeader);

//   const cookies = parse(cookieHeader);
//   const session = cookies.session;
//   if (!session) return;

//   const parsed = await decrypt(session);
//   console.log(parsed);
//   parsed.expires = new Date(0);
//   console.log(parsed);
//   res.setHeader('Set-Cookie', `session=${await encrypt(parsed)}; HttpOnly; Expires=${parsed.expires.toUTCString()}`);

//   // const res = NextResponse.next();
//   // res.cookies.set({
//   //   username: "session",
//   //   value: await encrypt(parsed),
//   //   httpOnly: true,
//   //   expires: parsed.expires,
//   // });
//   // return res;
// }



async function updateSession(request, res) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return;

  const sessionCookie = cookieHeader.split('; ').find(cookie => cookie.startsWith('session='));
  if (!sessionCookie) return;

  const sessionToken = sessionCookie.split('=')[1];
  let sessionData;
  
  try {
    sessionData = decrypt(sessionToken);
  } catch (err) {
    console.error('Failed to decode session token:', err);
    return;
  }

  // Ensure sessionData is an object
  if (typeof sessionData !== 'object' || sessionData === null) {
    console.error('Session data is not an object:', sessionData);
    return;
  }

  // Update the expiration time to 0
  sessionData.exp = 0;

  // Encode the updated session token
  let updatedSessionToken;
  try {
    updatedSessionToken = encrypt(sessionData);
  } catch (err) {
    console.error('Failed to encode session token:', err);
    return;
  }

  // Set the updated cookie in the response
  res.setHeader('Set-Cookie', `session=${updatedSessionToken}; Path=/; HttpOnly`);

  console.log('Session updated and cookie set to expire immediately.');
}
module.exports = {
  encrypt,
  decrypt,
  readParticipantsData,
  login,
  logout,
  getSession,
  getSessionAPI,
  updateSession
};
