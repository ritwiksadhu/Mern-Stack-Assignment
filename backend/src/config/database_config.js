import mongoose from "mongoose";

// To suppress the deprecation warning
mongoose.set("strictQuery", true); // or false based on your preference

const databaseConnect = async () => {
  try {
    const dbURL =
      process.env.NODE_ENV === "DEV"
        ? process.env.DEV_DBURL
        : process.env.PROD_DBURL;
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit process with failure
  }
};

export default databaseConnect;
