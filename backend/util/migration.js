import chalk from "chalk";
import settings from "./settings.js";
import Umzug from "umzug";

async function migrate(sequelize) {
  await new Umzug({
    migrations: {
      path: settings.migration.directory,
      params: [sequelize.getQueryInterface()],
    },
    storage: "sequelize",
    storageOptions: {
      sequelize: sequelize,
    },
  })
    .on("migrated", (e) => console.log(chalk.green("✓  MIGRATION EXECUTED"), e))
    .up();
}

async function migrationHelper(sequelize) {
  if (settings.migration.migrate) {
    await migrate(sequelize);
  } else {
    console.log(chalk.yellow("⚠  MIGRATION execution is toggled off"));
  }
}

export default migrationHelper;
