const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    //console.log(err);
    if (err) {
        return console.log('Unable to connect to moongo db server');
    }
    console.log('Connected to MongoDB server');

    db.collection("Users").findOneAndUpdate({
        _id : ObjectID("5bbcbf077ed06c4aa4872243")
    },{
        $set:{
            name: "Something else"
        },
        $inc:{
            age: 1,
            notthere2: -3
        }
    },{
        returnOriginal: false
    }).then((results) => {
        console.log(results);
    })
});