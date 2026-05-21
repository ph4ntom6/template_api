import { AbstractModel } from "./AbstractModel";

export default (sequelize, DataTypes) => {
  class AppVersion extends AbstractModel {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  AppVersion.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      platform: {
        type: DataTypes.ENUM,
        values: ["android", "ios"],
        defaultValue: null,
      },
      criticalVersion: {
        type: DataTypes.STRING(100),
        defaultValue: null,
      },
      forceUpdate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "app_versions",
      timestamps: true,
    },
  );

  return AppVersion;
};
