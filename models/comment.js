var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema setup
var commentSchema = new Schema({
    text : String,
    author :
        {
            id: {
                type : mongoose.Schema.Types.ObjectId,
                ref  : 'User'
            },
            username : String
        }

});

// making model
var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;