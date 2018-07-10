const {MongoClient, ObjectID} = require('mongodb');

// MongoDB URI
const URI = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(URI, { useNewUrlParser: true }, (err, db) => {
    if (err) {
        return console.error('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server')

    db.collection('Todos').find().count()
      .then((count) => {
          console.log(`Todos count: ${count}`);
      })
      .catch((error) => {
        console.log('Unable to fetch todos', error);
      });

})