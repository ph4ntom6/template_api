import express from "express";
import path from "path";
import lumie from "lumie";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

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
  ignore: ["*.spec", "*.action", "*.md"],
  controllers_path: path.join(__dirname, "controllers"),
});

const server = app.listen(3000, "127.0.0.1", () => {
  const { address, port } = server.address();
  console.log("Example app listening at http://%s:%s", address, port);
});
