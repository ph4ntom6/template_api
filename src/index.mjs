import express from "express";
import lumie from "lumie";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

(async function () {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();

  // parse the form data from body using body parser
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  // parse the json from body using body parser
  app.use(
    bodyParser.json({
      limit: "100mb",
    })
  );

  lumie.load(app, {
    preURL: "api",
    verbose: true,
    ignore: ["*.spec", "*.action", "*.md"],
    controllers_path: path.join(__dirname, "./controllers"),
  });

  const port = 3000;
  app.listen(port, () => {
    console.log("App server started on port " + port);
  });
})();
