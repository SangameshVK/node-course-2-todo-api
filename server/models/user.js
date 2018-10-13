var mongoose = require('mongoose');

var User = mongoose.model('User', {
    email: {
        type: String,
        require: true,
        minlegth: 1,
        trim: true
    }
});

module.exports = {
    User
};