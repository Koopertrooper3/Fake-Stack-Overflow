const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModelSchema = new Schema(
    {   
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'user'
        },
        questionsAsked: [{
            type: Schema.Types.ObjectId,
            ref: 'questionsModel',
        }],
        questionsAnswered: [{
            type: Schema.Types.ObjectId,
            ref: 'questionsModel',
        }],
        tagsCreated: [{
            type: Schema.Types.ObjectId,
            ref: 'tagsModel',
        }],
        reputation: {
            type: Number,
            default: 50
        },
        joinedDate: {
            type: Date,
            default: Date.now
        }
        
    }, 
    { timestamps: true},

)

UserModelSchema
.virtual('url')
.get(function () {
  return ' posts/tag/' + this._id;
});
module.exports = mongoose.model('User', UserModelSchema);