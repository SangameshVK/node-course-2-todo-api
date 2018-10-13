

var newTodo = new Todo({
    text: 'Cook dinners',
});

// newTodo.save().then((doc) => {
//     console.log('Save todo:', doc);
// }, (e) => {
//     console.log(e);
// });

var secondTodo = new Todo({
    text: false,
    completed: '-10',
    // completedAt: null
});
// secondTodo.save().then((doc) => {
//     console.log('Saved second todo', doc);
// });

// User model
// email - require it, trim it - type - lenght



var user1 = new User({
    email: 'vksangamesh'
});
user1.save().then((doc)=> {
    console.log(doc);
});