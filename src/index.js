const app = require("./app");

const port = process.env.PORT; // port coming from .env file

app.listen(port, () => {
  console.log("server is running on port :" + port);
});
