require('./config/config');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos',authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400);
        res.send(e);
    });
});

app.get('/todos', authenticate,(req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({
            todos
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)){
        res.status(400).send({error: "ID invalid"});
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo){
            res.status(404).send({error: "ID not found"});
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)){
        res.status(400).send({error: "ID invalid"});
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo){
            res.status(404).send({error: "ID not found"});
        }
        res.send({todo});
    }, (err) => {
        console.log(err);
        res.status(500).send({error: "An unknown error occurred"});
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)){
        return res.status(400).send();
    }

    if (_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime(); 
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if (!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    //We can choose to not have .then(("user") =>) 
    //because user variable returned is the same as 
    //the one defined above
    user.save().then(() => { 
        return user.generateAuthToken();
        //res.send(user)
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        //console.log("Caught errore", e);
        res.status(400);
        res.send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send(e);
    });

    // User.findOne({email: body.email}).then((user) => {
    //     if(!user){
    //         return res.status(404).send("User doesn't exist");
    //     }
    //     bcrypt.compare(body.password, user.password, (err, result) => {
    //         if (err) {
    //             return res.status(401).send("Password incorrect");
    //         }
    //         if(result == true){
    //             return res.status(200).header('x-auth', user.token).send('Auth success');
    //         }
    //         res.status(401).send("Password incorrect");
    //     });
    // }).catch((err) => {
    //     res.status(500).send(err);
    // });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then((user) => {
        //console.log("Updated==================");
        //console.log(user);
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};