require("dotenv").config();
require("./redis/blocklist-access-token");
require("./redis/allowlist-refresh-token");

const app = require("./app");
const routes = require("./rotas");
const port = 3000;

routes(app);

app.listen(port, () => console.log(`App listening on port ${port}`));
