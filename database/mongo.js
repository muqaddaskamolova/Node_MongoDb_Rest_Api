const { MongoClient } = require("mongodb");
let dbConnection;
/*
const Db = process.env.ATLAS_URI
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  connectToDb: function (callback) {
    client.connect(function (err, db) {
      if (db) {
        dbConnection = client.db("bookstore");
        console.log("Successfully connected to MongoDB.");
      }

      return callback(err);
    });
  },

  getDb: function () {
    return dbConnection;
  },
};
*/
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increased timeout value
  maxPoolSize: 50,
  wtimeoutMS: 25000,
  socketTimeoutMS: 60000,
};
module.exports = {
  connectToDb: (callback) => {
    MongoClient.connect("mongodb://127.0.0.1:27017", options)
      .then((client) => {
        dbConnection = client.db("bookstore");
        return callback();
      })
      .catch((err) => {
        console.log(err);
        return callback(err);
      });
  },
  getDb: () => dbConnection,
};
