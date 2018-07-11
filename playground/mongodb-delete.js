const {MongoClient, ObjectID} = require('mongodb');

// MongoDB URI
const URI = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(URI, { useNewUrlParser: true }, (err, db) => {
    if (err) {
        return console.error('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server')

    // deleteMany
    // db.collection('Todos').deleteMany({ text: 'Something to do' })
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((error) => {
    //       console.log(error.message);
    //   })
    
    // deleteOne
    // db.collection('Todos').deleteOne({ text: 'Something to do' })
    //   .then((result) => {
    //       console.log(result);
    //   })
    //   .catch((error) => {
    //       console.error(error.message);
    //   })
    
    // findOneAndDelete
    db.collection('Todos').findOneAndDelete({ completed: true })
      .then((result) => {
          console.log(result);
      })
      .catch((error) => {
          console.error(error.message);
      })

    // db.close()

})