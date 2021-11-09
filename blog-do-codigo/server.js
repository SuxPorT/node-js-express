require("dotenv").config();
require("./redis/blacklist");

const app = require("./app");
const db = require("./database");
const routes = require("./rotas");
const port = 3000;

routes(app);

app.listen(port, () => console.log(`App listening on port ${port}`));
