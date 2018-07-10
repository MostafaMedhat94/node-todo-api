const {MongoClient, ObjectID} = require('mongodb');

// MongoDB URI
const URI = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(URI, { useNewUrlParser: true }, (err, db) => {
    if (err) {
        return console.error('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server')

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log(`Unable to insert todo`, err.message);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 4));

    // })

    db.collection('Users').insertOne({
        name: 'Mostafa',
        age: 24,
        location: 'Cairo, Egypt'
    }, (err, result) => {
        if (err) {
            return console.log(`Unable to insert todo`, err.message);
        }
        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 4));
    })
    db.close();
});