import axios from "axios";
import jwt from "jsonwebtoken";

import { UserModel, RoleModel } from "../../models";

import translate from "../../helpers/translate";
import generateToken from "../../helpers/generate-token";

export const connect = async (request, response) => {
  const { token, platform, fullName } = request.body;
  let data;
  switch (platform) {
    case "google":
      data = await google(token, response);
      break;
    case "facebook":
      data = await facebook(token, response);
      break;
    case "twitter":
      data = await twitter(token, response);
      break;
    case "apple":
      data = await apple(token, fullName, response);
      break;
    default:
      // return error message
      return response.status(404).json({
        message: translate("errors", "account.invalidPlatform"),
      });
  }

  try {
    let user = null;
    let role = null;
    const body = {};

    if (data?.email) {
      // retrieve user from payload
      user = await UserModel.findOne({
        where: { email: data?.email },
        raw: true,
        attributes: ["id", "email", "status", "roleTitle"],
      });

      if (!user) {
        // role
        role = await RoleModel.findOne({
          where: { title: "User" },
          attributes: ["id", "title", "scopes"],
          raw: true,
        });

        // create user
        body.roleId = role?.id;
        body.roleTitle = role?.title;
        body.email = data?.email;
        body.status = "active";
        body.fullName = data?.fullName;
        user = await UserModel.create({
          body,
        });
      } else {
        // if user is blocked then return error
        if (user.status === "blocked") {
          return response.status(403).json({
            message: translate("errors", "account.blocked"),
          });
        }

        const body = {
          status: "active",
        };

        await UserModel.updateByPk(user?.id, { body });

        // role
        role = await RoleModel.findOne({
          where: { title: user?.roleTitle },
          attributes: ["id", "title", "scopes"],
          raw: true,
        });
      }

      // generate access token and refresh token
      const token = await generateToken(user, role?.scopes, true);

      return response.status(200).json({
        message: translate("messages", "login.successful"),
        data: {
          id: user.id,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          expiresIn: token.tokenExpirationDate,
        },
      });
    }

    // send error if credentials are invalid
    return response.status(404).json({
      message: translate("errors", "credentials.invalid"),
    });
  } catch (error) {
    // execute in case of internal server error
    // eslint-disable-next-line
    console.log(error);
    return response.status(422).json({
      message: error,
    });
  }
};

const google = async function (token, response) {
  try {
    const output = await axios({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const info = output?.data;
    // eslint-disable-next-line
    console.log(info);
    if (info) {
      return {
        fullName: info?.name,
        email: info?.email,
      };
    }
  } catch (error) {
    // execute in case of internal server error
    // eslint-disable-next-line
    console.log(error);
    return response.status(422).json({
      message: error,
    });
  }
};

const facebook = async function (token, response) {
  try {
    const output = await axios({
      url: "https://graph.facebook.com/v15.0/me",
      method: "get",
      params: {
        fields: "id,name,email",
        access_token: token,
      },
    });
    const info = output?.data;

    if (info) {
      return {
        fullName: info?.name,
        email: info?.email,
      };
    }
  } catch (error) {
    // execute in case of internal server error
    // eslint-disable-next-line
    console.log(error);
    return response.status(422).json({
      message: error,
    });
  }
};

const twitter = async function (token, response) {
  try {
    const output = await axios({
      url: "https://api.twitter.com/2/users/me",
      method: "get",
      params: {
        "user.fields": "id,name,email",
        access_token: token,
      },
    });
    const info = output?.data;

    if (info) {
      return {
        fullName: info?.name,
        email: info?.email,
      };
    }
  } catch (error) {
    // execute in case of internal server error
    // eslint-disable-next-line
    console.log(error);
    return response.status(422).json({
      message: error,
    });
  }
};

const apple = async function (token, fullName, response) {
  try {
    const info = await jwt.decode(token);

    if (info) {
      return {
        email: info?.email,
        fullName: fullName || "",
      };
    }
  } catch (error) {
    // execute in case of internal server error
    // eslint-disable-next-line
    console.log(error);
    return response.status(422).json({
      message: error,
    });
  }
};
