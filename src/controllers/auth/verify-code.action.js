import { UserModel, RoleModel } from "../../models";

import AppValidationError from "../../exceptions/AppValidationError";

import translate from "../../helpers/translate";
import generateToken from "../../helpers/generate-token";

/* Verify  Account
 * @description This method will verify user's account
 * @input verification code
 * @return (Object)
 */
export const verifyCode = async (request, response) => {
  const {
    body: { verificationCode, activationToken, email },
  } = request;

  let where = {
    verificationCode,
  };

  let body = {
    status: "active",
    verificationCode: null,
  };

  if (activationToken) {
    where = {
      activationToken,
    };
    body = {
      status: "active",
      activationToken: null,
    };
  }

  if (email) {
    where.email = email;
  }

  /* check if user is in pending status */
  let user = await UserModel.findOne({
    where,
    raw: true,
    attributes: ["id", "roleTitle", "status"],
  });

  /* throw error if user does not exist or verification code does not match */
  if (!user) {
    throw new AppValidationError(
      translate("errors", "account.invalidCode", {
        ":attribute": activationToken
          ? "Activation token"
          : "Verification code",
      }),
    );
  }

  /* check if user is in blocked status */
  if (user?.status === "blocked") {
    throw new AppValidationError(translate("errors", "account.blocked"));
  }

  user = await UserModel.updateByPk(user.id, {
    body,
  });

  const role = await RoleModel.findOne({
    where: {
      title: user?.roleTitle,
    },
    attributes: ["id", "scopes"],
    raw: true,
  });

  /* generate tokens */
  const data = await generateToken(user, role?.scopes);

  return response.json({
    data: {
      id: user.id,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.tokenExpirationDate,
    },
  });
};
