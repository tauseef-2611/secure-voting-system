"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
}

const adminSecretKey = process.env.ADMIN_SECRET_KEY;
const adminkey = new TextEncoder().encode(adminSecretKey);

export async function adminencrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5h")
    .sign(adminkey);
}

export async function decrypt(input) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      throw new Error('Token has expired');
    }
    throw new Error('Token verification failed');
  }
}

export async function admindecrypt(input) {
  try {
    const { payload } = await jwtVerify(input, adminkey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      throw new Error('Admin token has expired');
    }
    throw new Error('Admin token verification failed');
  }
}

export async function doLogin(user) {
  try {
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const session = await encrypt({ user, expires });
    cookies().set("session", session, { expires, httpOnly: true });

    return "Success"; // Return success message on successful login
  } catch (error) {
    return error.message;
  }
}

export async function adminLogin(username, password) {
  if (username !== "admin" || password !== "master") {
    return false;
  }
  // Verify credentials && get the user
  const user = { username: username, password: password };
  // Create the session
  const expires = new Date(Date.now() + 5 * 60 * 60 * 1000);
  const session = await adminencrypt({ user, expires });

  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });
  return true;
}

export async function doLogout() {
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}