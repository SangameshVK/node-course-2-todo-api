const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

//var id = "5bc193f531b08c4c6a90d13e";
var id = "dfasdfsdfsdfsdfsd"; //Throws exception
// if (!ObjectID.isValid(id)){
//     console.log("ID not valid");
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     if (!todo){
//         return console.log('ID not found');
//     }
//     console.log('Todo', todo);
// });

Todo.findById(id).then((todo) => {
    if (!todo){
        return console.log('ID not found');
    }
    console.log('Todo by id', todo);
}).catch((e) => console.log("catch call")); //can handle in reject call as well