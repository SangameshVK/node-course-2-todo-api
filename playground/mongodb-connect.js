//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //Destructuring

//Playing
// var obj = new ObjectID();
// console.log(obj);

// var user = {name: 'andrew', age: 25}
// var {name} = user;
// console.log(name);
//Playing done

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    //console.log(err);
    if (err) {
        return console.log('Unable to connect to moongo db server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })

    // db.collection('Users').insertOne({
    //     name: 'Sangamesh',
    //     age: 23,
    //     location: 'nagathan'
    // }, (err, result) => {
    //     if (err){
    //         return console.log('unable to insert User', err);
    //     }
    //     //console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(result.ops[0]._id.getTimestamp());
    // })

    db.close();
});