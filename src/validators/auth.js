import { check } from "express-validator";

/** helpers functions **/
import translate from "../helpers/translate";
import sentenceCase from "../helpers/sentence-case";

export const validate = (
  field,
  customMsg = null,
  min = null,
  max = null,
  required = true,
) => {
  switch (field) {
    case "email": {
      return check(field)
        .not()
        .isEmpty()
        .withMessage(
          translate("validations", "required", {
            ":attribute": sentenceCase(field),
          }),
        )
        .isEmail()
        .withMessage(
          translate("validations", "valid", {
            ":attribute": sentenceCase(field),
          }),
        );
    }

    case "password": {
      return check(field)
        .not()
        .isEmpty()
        .withMessage(
          translate("validations", "required", {
            ":attribute": sentenceCase(field),
          }),
        )
        .isLength({ min: 8, max: 50 })
        .withMessage(
          translate("validations", "length", {
            ":attribute": "Password",
            ":min": "8",
            ":max": "50",
          }),
        )
        .matches(/^.*[0-9].*$/)
        .withMessage(
          translate("validations", "password.characters", {
            ":attribute": "Password",
          }),
        );
    }

    case "remember": {
      return check(field)
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage(
          translate("validations", "boolean", {
            ":attribute": sentenceCase(field),
          }),
        );
    }
    case "loginRequirment": {
      return check("email")
        .not()
        .isEmpty()
        .withMessage(
          translate("validations", "required", {
            ":attribute": "Email",
          }),
        );
    }

    case "verificationCode": {
      return check("verification_code")
        .not()
        .isEmpty()
        .withMessage(
          translate("validations", "required", {
            ":attribute": "Verification Code",
          }),
        )
        .isLength({ min: min ?? 6, max: max ?? 6 })
        .withMessage(
          translate("validations", "length", {
            ":attribute": "Verification Code",
            ":min": String(min ?? 6),
            ":max": String(max ?? 6),
          }),
        );
    }
  }
};
