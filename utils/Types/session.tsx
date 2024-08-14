import { JWTPayload } from "jose";
export type Session = JWTPayload & {
    user: {
      username: string;
      password: string;
    };
    expires: string;
  };