const {MongoClient, ObjectID} = require('mongodb');

// MongoDB URI
const URI = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(URI, { useNewUrlParser: true }, (err, db) => {
    if (err) {
        return console.error('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b447db43e3e8b2512e8852a'),
    },{
        $set: {
            name: 'Mostafa Medhat'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    })
      .then((result) => {
          console.log(result);
      })
      .catch((error) => {
          console.error(error.message);
      })
    // db.close()

})