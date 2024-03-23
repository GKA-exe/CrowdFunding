const express = require("express");
const app = express();
const path = require("path");
const mongoClient = require("mongodb").MongoClient;

const userRouter = require("./routes/user");
const campaignRouter = require("./routes/campaign");
const adminRouter = require("./routes/admin");

require("dotenv").config();

mongoClient
  .connect(process.env.DB_URL)
  .then((client) => {
    const dbObj = client.db(process.env.DB_NAME);

    const campaignCollection = dbObj.collection("campaignsCollection");
    const userCollection = dbObj.collection("usersCollection");
    const otpCollection = dbObj.collection("otpCollection");

    app.set("userCollection", userCollection);
    app.set("campaignCollection", campaignCollection);
    app.set("otpCollection", otpCollection);

    console.log("Established Connection with the Database.");
  })
  .catch((error) => console.log(error));

const port = process.env.PORT || 4040;

app.use(express.json());
app.use("/user", userRouter);
app.use("/campaign", campaignRouter);
app.use("/admin", adminRouter);
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.use((err, req, res, next) => {
  console.log(err);
});

app.listen(port, () => console.log(`Server live on http://localhost:${port}/`));
