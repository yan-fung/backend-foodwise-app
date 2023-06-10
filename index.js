const express = require("express");
const app = express();

APP_PORT = 4000;
app.listen(APP_PORT, () => console.log(`App is running on port ${APP_PORT}`))