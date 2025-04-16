const { MongoClient, ObjectId } = require("mongodb");

// Connection URI (replace with your actual connection string)
const uri = "mongodb://localhost:27017"; // Replace with your DB info
const database = "task-manager";

let client;

async function connectToMongoDB(database) {
  let client;
  try {
    client = new MongoClient(uri);
    // Connect to the MongoDB server
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    return client.db(database); // Return the database object
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Propagate the error
  }
}

async function connect(database) {
  try {
    client = new MongoClient(uri);
    await client.connect(database);
    console.log("client connected!");
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    return client.db(database);
  } catch (error) {
    console.log("Failed to connect");
    throw new Error("Failed to connect to MongoDB");
  }
}

function connect(database) {
  let client;
  return new Promise((resolve, reject) => {
    client = new MongoClient(uri);
    client
      .connect()
      .then(() => {
        console.log("Successfully connected to MongoDB!");
        resolve(client.db(database)); // Resolve with the database object
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        reject(error); // Reject the promise
      });
  });
}

// return new Promise((resolve, reject) => {
//   try {
//     client = new MongoClient(uri);
//     client.connect().then(() => {
//       resolve(client.db(database));
//     });
//   } catch (error) {
//     reject(err);
//   }
// });

async function insertData(data) {
  const db = await connectToMongoDB(database);
  console.log("db connected");
  db.collection("users")
    .insertOne(data)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
    });
}

async function getData() {
  try {
    db = await connect(database);
    console.log("db connected");
    db.collection("users")
      .find({})
      .toArray()
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log("Connection Failed:", error);
  } finally {
    await closeConnection();
  }
}

async function deletData(filter) {
  const db = await connectToMongoDB(database);
  db.collection("users")
    .deleteMany(filter)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function updatData(filter, data) {
  const db = await connectToMongoDB(database);
  db.collection("users")
    .updateMany(
      { name: "hayou" },
      {
        $rename: { age: "age1" },
      }
    )
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

insertData({ name: "hayou" });
deletData({ _id: new ObjectId("67f82bfc4a6c6b5c59fe92c6") });
updatData({ name: "hayou" }, { age: 100 });
