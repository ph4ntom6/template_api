import { get } from "./list.action";
import { view } from "./view.action";
import { create } from "./create.action";
import { update } from "./update.action";
import { profile } from "./profile.action";
import { deleteUser } from "./delete.action";
import checkScopes from "../../middleware/check-scopes";
import authenticate from "../../middleware/authenticate";
import { asyncHandler } from "../../middleware/exception-handler";
import validationResponse from "../../middleware/validation-response";

import { validate } from "../../validators/user";

module.exports = {
  "/profile": {
    get: {
      middlewares: [authenticate, checkScopes("user")],
      action: asyncHandler(profile),
    },
  },
  "/": {
    post: {
      middlewares: [
        authenticate,
        checkScopes("admin"),
        validate("fullName", null, 2, 100),
        validate("email"),
        validationResponse,
      ],
      action: asyncHandler(create),
    },
    get: {
      middlewares: [authenticate, checkScopes("admin", "business")],
      action: asyncHandler(get),
    },
  },
  "/me": {
    get: {
      middlewares: [authenticate],
      action: asyncHandler(view),
    },
    put: {
      middlewares: [
        authenticate,
        validate("fullName", null, 2, 100, false),
        validate("email", null, null, null, false),
        validate("gender", ["male", "female"], null, null, false),
        validate("dateOfBirth", null, null, null, false),
        validate("mobileNumber", null, null, null, false),
        validate("city", null, 2, 100, false),
        validate("height", null, null, null, false),
        validate("weight", null, null, null, false),
        validate("languages", null, 1, 5, false),
        validate("tags", null, 1, 5, false),
        validate("bio", null, 2, 300, false),
        validate("status", ["active", "blocked"], null, null, false),
        validate("profilePhoto", null, null, null, false),
        validate("profilePhoto.originalName", null, null, null, false),
        validate("profilePhoto.fileName", null, null, null, false),
        validate("profilePhoto.fileURL", null, null, null, false),
        validate("profilePhoto.thumbnailURL", null, null, null, false),
        validationResponse,
      ],
      action: asyncHandler(update),
    },
    delete: {
      middlewares: [authenticate, checkScopes("user")],
      action: asyncHandler(deleteUser),
    },
  },
  "/:id": {
    get: {
      middlewares: [
        authenticate,
        checkScopes("admin"),
        validate("id", null, 1),
        validationResponse,
      ],
      action: asyncHandler(view),
    },
    put: {
      middlewares: [
        authenticate,
        checkScopes("admin"),
        validate("id", null, 1),
        validate("fullName", null, 2, 100, false),
        validate("email", null, null, null, false),
        validate("gender", ["male", "female"], null, null, false),
        validate("dateOfBirth", null, null, null, false),
        validate("mobileNumber", null, null, null, false),
        validate("city", null, 2, 100, false),
        validate("height", null, null, null, false),
        validate("weight", null, null, null, false),
        validate("languages", null, 1, 5, false),
        validate("tags", null, 1, 5, false),
        validate("bio", null, 2, 300, false),
        validate("status", ["active", "blocked"], null, null, false),
        validate("profilePhoto", null, null, null, false),
        validate("profilePhoto.originalName", null, null, null, false),
        validate("profilePhoto.fileName", null, null, null, false),
        validate("profilePhoto.fileURL", null, null, null, false),
        validate("profilePhoto.thumbnailURL", null, null, null, false),
        validationResponse,
      ],
      action: asyncHandler(update),
    },
  },
};
