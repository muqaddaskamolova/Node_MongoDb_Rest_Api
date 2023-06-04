const express = require("express");
const { ObjectId } = require("mongodb");

const mongo = require("./database/mongo");

//init app and middleware
const app = express();
app.use(express.json());
// db connection
port = 3000;
let db;
mongo.connectToDb((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
    db = mongo.getDb();
  }
});

// routes
app.get("/books", (req, res) => {
  const page = req.query.p || 0;
  const booksPerPage = 3;
  let books = [];
  db.collection("books")
    .find()
    .sort({ author: 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
});

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((error) => {
        res.status(500).json({ error: "Could not fetch the documents" });
      });
  } else {
    res.status(500).json({ error: "Not a valid doc id" });
  }
});
app.post("/books/add", (req, res) => {
  const book = req.body;
  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not create a new document" });
    });
});
app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: "Could not delete the document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid doc id" });
  }
});
app.patch("/books/:id", (req, res) => {
  const updates = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: "Could not update the document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid doc id" });
  }
});
