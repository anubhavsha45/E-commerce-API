require("dotenv").config({ path: "./config.env" });

const mongoose = require("mongoose");
const app = require("./app");

const DB = process.env.MONGO_URL.replace(
  "<DB_PASSWORD>",
  process.env.DB_PASSWORD,
);

mongoose.connect(DB).then(() => console.log("DB connection succesfull"));
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening to the port ${PORT}`);
});
