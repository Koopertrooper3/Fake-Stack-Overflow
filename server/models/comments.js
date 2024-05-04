// Comments Document Schema
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentsModelSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    comment_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment_date_time: {
        type: Date,
        default: Date.now
    },
    votes: {
        type: Number, 
        default: 0
    }
});

commentsModelSchema
.virtual('url')
.get(function () {
    return 'posts/answer/' + this._id;
});

var answerModel = mongoose.model('commentModel', commentsModelSchema);
module.exports = answerModel;