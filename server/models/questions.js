// Question Document Schema
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionsModelSchema = new Schema ({
    title: {
        type: String,
        maxlength: 100,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    tags: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'tagsModel'
        }],
        validate: {
            validator: function(tags) {
                return tags.length > 0;
            },
            message: 'At least one tag is required'
        },
        required: true
    },
    answers: [{
        type: Schema.Types.ObjectId,
        ref: 'answerModel',
    }],
    asked_by: {
        type: String,
        default: "Anonymous"
    },
    ask_date_time: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    votes: {
        type: Number, 
        default: 0 
    }
});

questionsModelSchema
.virtual('url')
.get(function () {
  return ' posts/question/' + this._id;
});

var questionsModel = mongoose.model('questionsModel', questionsModelSchema);
module.exports = questionsModel;
