require("dotenv").config({ path: "./../config.env" });

const fs = require("fs");
const mongoose = require("mongoose");

const User = require("./../models/User");
const Product = require("./../models/Product");

const DB = process.env.MONGO_URL.replace(
  "<DB_PASSWORD>",
  process.env.DB_PASSWORD,
);

mongoose.connect(DB).then(() => console.log("DB connection successful"));

const usersData = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, "utf-8"),
);

const productsData = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, "utf-8"),
);

const importData = async () => {
  try {
    await User.create(usersData);
    await Product.create(productsData);

    console.log("Imported successfully");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    console.log("Data deleted successfully");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
