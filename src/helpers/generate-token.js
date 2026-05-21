import jwt from "jsonwebtoken";
import dayjs from "dayjs";

import { TokenModel, RefreshTokenModel } from "../models";

export default async (user, scopes = [], remember = false) => {
  // number of seconds in a day
  const secondsInADay = 24 * 60 * 60;

  // set token expiration based on remember me
  const tokenExpirationDate = remember
    ? dayjs().add(process.env.TOKEN_EXPIRATION_TIME_REMEMBER_ME, "days")
    : dayjs().add(process.env.TOKEN_EXPIRATION_TIME, "days");

  const refreshTokenExpirationDate = remember
    ? dayjs().add(process.env.TOKEN_EXPIRATION_TIME_REMEMBER_ME, "days")
    : dayjs().add(process.env.TOKEN_EXPIRATION_TIME, "days");

  // Store the access token to the database
  const accessTokenInstance = await TokenModel.create({
    body: {
      scopes: scopes,
      userId: user.id,
      revoked: null,
      revokedAt: null,
      expiresAt: tokenExpirationDate,
    },
  });

  // Store the refresh token to the database
  const refreshTokenInstance = await RefreshTokenModel.create({
    body: {
      accessTokenId: accessTokenInstance.id,
      revoked: null,
      revokedAt: null,
      expiresAt: refreshTokenExpirationDate,
    },
  });

  // generate jwt to access token
  const accessToken = jwt.sign(
    {
      id: accessTokenInstance.id,
      userId: user.id,
      clientId: process.env.CLIENT_ID,
      scopes: scopes,
    },
    process.env.CLIENT_SECRET,
    {
      expiresIn: remember
        ? process.env.TOKEN_EXPIRATION_TIME_REMEMBER_ME * secondsInADay
        : process.env.TOKEN_EXPIRATION_TIME * secondsInADay,
    },
  );

  // generate jwt to refresh token
  const refreshToken = jwt.sign(
    {
      id: refreshTokenInstance.id,
      userId: user.id,
      clientId: process.env.CLIENT_ID,
    },
    process.env.CLIENT_SECRET,
    {
      expiresIn: remember
        ? process.env.TOKEN_EXPIRATION_TIME_REMEMBER_ME * secondsInADay
        : process.env.TOKEN_EXPIRATION_TIME * secondsInADay,
    },
  );

  return {
    accessToken,
    refreshToken,
    tokenExpirationDate,
  };
};
