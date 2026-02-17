// start server

const dotenv = require('dotenv')
dotenv.config()
// load root .env (if present) then fallback to src/models/.env
dotenv.config();
if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  dotenv.config({ path: __dirname + "/src/.env" });
}
const app = require("./src/app");
const connectDB = require("./src/db/db");

(async () => {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log("server is running on 3000");
    });
  } catch (err) {
    console.error("Failed to start server due to DB connection error");
    process.exit(1);
  }
})();
