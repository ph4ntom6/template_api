import { login } from "./login.action";
import { logout } from "./logout.action";
import { refresh } from "./refresh.action";

import { check } from "express-validator";

/* middlewares */
import { validate } from "../../validators/auth";
``;
/** helpers functions **/
import translate from "../../helpers/translate";

import authenticate from "../../middleware/authenticate";
import validationResponse from "../../middleware/validation-response";
import { asyncHandler } from "../../middleware/exception-handler";

module.exports = {
  "/login": {
    post: {
      middlewares: [
        validate("email"),
        check("password")
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": "Password",
            })
          ),
        validate("remember"),
        validationResponse,
      ],
      action: login,
    },
  },
  "/logout": {
    post: {
      middlewares: [authenticate],
      action: logout,
    },
  },
  "/refresh": {
    post: {
      action: asyncHandler(refresh),
    },
  },
};
