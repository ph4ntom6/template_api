import Sequelize from "sequelize";
import { createClient } from "../config/redis";

import User from "./User";
import Role from "./Role";
import Token from "./OAuthToken";

const mysql = require("../config/database");

const sequelize = new Sequelize(
  mysql.database,
  mysql.username,
  mysql.password,
  mysql
);

/*
 * connect to the redis wait for the connection then proceed
 */
createClient();

export default sequelize;

export const TokenModel = Token(sequelize, Sequelize.DataTypes);

export const RefreshTokenModel = RefreshToken(sequelize, Sequelize.DataTypes);

export const RoleModel = Role(sequelize, Sequelize.DataTypes);

export const UserModel = User(sequelize, Sequelize.DataTypes);

export const ReadAlertModel = ReadAlert(sequelize, Sequelize.DataTypes);

BillModel.associateManually();
BillVersionModel.associateManually();
ClientBillImpactsModel.associateManually();
UserModel.associateManually();
BusinessModel.associateManually();
BillHistoryModel.associateManually();
AlertModel.associateManually();
ClientBillTrackingModel.associateManually();
