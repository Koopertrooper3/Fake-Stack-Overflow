// Answer Document Schema
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answersModelSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    ans_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ans_date_time: {
        type: Date,
        default: Date.now
    },
    votes: {
        type: Number, 
        default: 0
    }
});

answersModelSchema
.virtual('url')
.get(function () {
    return 'posts/answer/' + this._id;
});

var answerModel = mongoose.model('answerModel', answersModelSchema);
module.exports = answerModel;
