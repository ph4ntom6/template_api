import express from "express";
import path, { dirname } from "path";
import lumie from "lumie";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

//   parse the form data from body using body parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/**
 * parse the json from body using body parser
 */
app.use(
  bodyParser.json({
    limit: "100mb",
  })
);

lumie.load(app, {
  preURL: "api",
  verbose: true,
  ignore: ["*.spec", "*.action"],
  controllers_path: path.join(__dirname, "controllers"),
});

const port = 3000;
app.listen(port, () => {
  // eslint-disable-next-line
  console.log("App server started on port " + port);
});
