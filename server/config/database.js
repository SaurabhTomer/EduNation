import mongoose from "mongoose";
dotenv.config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("database is connected");
    })
    .catch((error) => {
      console.log("database connection failed");
      console.error(error);
      process.exit(1);
    });
};
