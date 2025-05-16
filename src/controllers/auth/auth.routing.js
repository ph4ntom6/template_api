// import { check } from "express-validator";

// import { connect } from "./connect.action";
// import { login } from "./login.action";
// import { logout } from "./logout.action";
// import { verifyCode } from "./verify-code.action";
// import { refresh } from "./refresh.action";

// import { validate } from "../../validators/auth";

// import { asyncHandler } from "../../middlewares/exception-handler";
// import validationResponse from "../../middlewares/validation-response";
// import authenticate from "../../middlewares/authenticate";

// import translate from "../../helpers/translate";

// module.exports = {
//   "/connect": {
//     post: {
//       middlewares: [
//         check("token")
//           .not()
//           .isEmpty()
//           .withMessage(
//             translate("validations", "required", {
//               ":attribute": "Token",
//             })
//           ),
//         validationResponse,
//       ],
//       action: connect,
//     },
//   },
//   "/login": {
//     post: {
//       middlewares: [
//         /* Apply middlewares*/
//         validate("loginRequirment"),
//         validate("email", null, 2, 100, false),
//         validationResponse,
//       ],
//       action: asyncHandler(login),
//     },
//   },
//   "/verify-code": {
//     post: {
//       middlewares: [
//         /* Apply middlewares*/
//         validate("email", null, 2, 100, false),
//         validate("verificationCode", null, 6, 6),
//         validationResponse,
//       ],
//       action: asyncHandler(verifyCode),
//     },
//   },
//   "/logout": {
//     post: {
//       middlewares: [authenticate],
//       action: logout,
//     },
//   },
//   "/refresh": {
//     post: {
//       middlewares: [],
//       action: asyncHandler(refresh),
//     },
//   },
// };
