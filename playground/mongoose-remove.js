const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((res) => {
//     console.log(res);
// });

//Todo.findOneAndRemove()
//Todo.findByIdAndRemove()

Todo.findByIdAndRemove('5bc1cdc63daae8fcc607be39').then((todo) => {
    console.log(todo);
});

//Todo.findOneAndRemove({_id: '5bc1cdc63daae8fcc607be39'})