import { check } from "express-validator";

import dayjs from "dayjs";

import translate from "../helpers/translate";
import sentenceCase from "../helpers/sentence-case";

export const validate = (
  field,
  values,
  min = 2,
  max = 100,
  isRequired = true,
) => {
  switch (field) {
    case "businessId":
    case "id":
    case "entryId": {
      return check(field)
        .not()
        .isEmpty()
        .withMessage(
          translate("validations", "required", {
            ":attribute": sentenceCase(field),
          }),
        )
        .isInt({ min })
        .withMessage(
          translate("validations", "numeric", {
            ":attribute": sentenceCase(field),
          }),
        );
    }
    case "ageMin":
    case "ageMax":
    case "weightMin":
    case "weightMax":
    case "weight":
    case "height":
    case "contestId": {
      const rule = check(field);
      if (isRequired) {
        rule
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": sentenceCase(field),
            }),
          );
      } else {
        rule.optional({
          checkNull: true,
          checkFalsy: true,
        });
      }
      return rule.isInt({ min }).withMessage(
        translate("validations", "numeric", {
          ":attribute": sentenceCase(field),
        }),
      );
    }

    case "heightMin":
    case "heightMax": {
      const rule = check(field);
      if (isRequired) {
        rule
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": sentenceCase(field),
            }),
          );
      } else {
        rule.optional({
          checkNull: true,
          checkFalsy: true,
        });
      }
      return rule.isFloat().withMessage(
        translate("validations", "float", {
          ":attribute": sentenceCase(field),
        }),
      );
    }

    case "caption":
    case "fullName":
    case "title":
    case "businessTitle":
    case "subTitle":
    case "challenge":
    case "city": {
      const rule = check(field);
      if (isRequired) {
        rule
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": sentenceCase(field),
            }),
          );
      } else {
        rule.optional();
      }
      return rule
        .isString()
        .withMessage(
          translate("validations", "string", {
            ":attribute": sentenceCase(field),
          }),
        )
        .isLength({ min, max })
        .withMessage(
          translate("validations", "charactersBetween", {
            ":attribute": sentenceCase(field),
            ":min": min.toString(),
            ":max": max.toString(),
          }),
        );
    }

    case "version": {
      const rule = check(field);
      if (isRequired) {
        rule
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": sentenceCase(field),
            }),
          );
      } else {
        rule.optional();
      }
      return rule.isString().withMessage(
        translate("validations", "string", {
          ":attribute": sentenceCase(field),
        }),
      );
    }
    case "bio": {
      const rule = check(field);
      if (isRequired) {
        rule
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": sentenceCase(field),
            }),
          );
      } else {
        rule.optional();
      }
      return rule
        .trim()
        .isString()
        .withMessage(
          translate("validations", "string", {
            ":attribute": sentenceCase(field),
          }),
        )
        .isLength({ max })
        .withMessage(
          translate("validations", "maxLength", {
            ":attribute": sentenceCase(field),
            ":max": max.toString(),
          }),
        );
    }
    case "email": {
      const rule = check(field);
      if (isRequired) {
        rule
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": sentenceCase(field),
            }),
          );
      } else {
        rule.optional({ checkFalsy: true });
      }
      return rule.isEmail().withMessage(
        translate("validations", "valid", {
          ":attribute": field,
        }),
      );
    }
    case "mobileNumber": {
      const rule = check(field);
      if (isRequired) {
        rule
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": sentenceCase(field),
            }),
          );
      } else {
        rule.optional({ checkFalsy: true });
      }
      return rule
        .matches(/^(0)[0-9]{10}$/)
        .withMessage(translate("validations", "mobileNumberCharacters"));
    }

    case "status": {
      const rule = check(field);
      if (isRequired) {
        rule
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": sentenceCase(field),
            }),
          );
      } else {
        rule.optional();
      }
      return rule
        .isString()
        .withMessage(
          translate("validations", "string", {
            ":attribute": field,
          }),
        )
        .isIn(values)
        .withMessage(
          translate("validations", "validOptions", {
            ":attribute": field,
          }),
        );
    }
    case "gender": {
      const rule = check(field);
      if (isRequired) {
        rule
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": sentenceCase(field),
            }),
          );
      } else {
        rule.optional();
      }
      return rule
        .isString()
        .withMessage(
          translate("validations", "string", {
            ":attribute": sentenceCase(field),
          }),
        )
        .isIn(values)
        .withMessage(
          translate("validations", "validOptions", {
            ":attribute": field,
          }),
        );
    }
    case "dateOfBirth": {
      const rule = check(field);
      if (!isRequired) {
        rule.optional({ checkFalsy: true });
      } else {
        rule
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": sentenceCase(field),
            }),
          );
      }
      return rule.custom(async (date) => {
        const now = dayjs().startOf("day");
        const selectedDate = dayjs(date, "YYYY-MM-DD");

        if (!selectedDate.isValid()) {
          throw new Error(
            translate("validations", "invalidDate", {
              ":attribute": sentenceCase(field),
            }),
          );
        }

        if (!selectedDate.isBefore(now)) {
          throw new Error(
            translate("validations", "dateBeforeNow", {
              ":attribute": sentenceCase(field),
            }),
          );
        }
      });
    }
    case "video":
    case "businessProfilePhoto":
    case "profilePhoto": {
      const rule = check(field);
      if (isRequired) {
        rule
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": sentenceCase(field),
            }),
          );
      } else {
        rule.optional({ checkFalsy: true });
      }
      return rule.isObject().withMessage(
        translate("validations", "object", {
          ":attribute": sentenceCase(field),
        }),
      );
    }
    case "video.thumbnailURL":
    case "video.fileURL":
    case "profilePhoto.thumbnailURL":
    case "profilePhoto.fileURL":
    case "businessProfilePhoto.thumbnailURL":
    case "businessProfilePhoto.fileURL": {
      const rule = check(field);
      if (isRequired) {
        rule
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": sentenceCase(field),
            }),
          );
      } else {
        rule.optional({ checkFalsy: true });
      }

      return rule.isURL({ require_protocol: true }).withMessage(
        translate("validations", "validURL", {
          ":attribute": sentenceCase(field),
        }),
      );
    }
    case "video.fileName":
    case "video.originalName":
    case "profilePhoto.fileName":
    case "profilePhoto.originalName":
    case "businessProfilePhoto.fileName":
    case "businessProfilePhoto.originalName": {
      const rule = check(field);
      if (isRequired) {
        rule
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": sentenceCase(field),
            }),
          );
      } else {
        rule.optional({ checkFalsy: true });
      }

      return rule.isString({ checkFalsy: true }).withMessage(
        translate("validations", "valid", {
          ":attribute": sentenceCase(field),
        }),
      );
    }
    case "languages":
    case "tags": {
      const rule = check(field);
      if (isRequired) {
        rule
          .not()
          .isEmpty()
          .withMessage(
            translate("validations", "required", {
              ":attribute": sentenceCase(field),
            }),
          );
      } else {
        rule.optional();
      }
      return rule.isArray({ min, max }).withMessage(
        translate("validations", "arrayLength", {
          ":attribute": sentenceCase(field),
          ":min": min,
          ":max": max,
        }),
      );
    }
  }
};
