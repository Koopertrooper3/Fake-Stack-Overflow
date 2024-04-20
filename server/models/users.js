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
        }
    }, 
    { timestamps: true},

)
module.exports = mongoose.model('User', UserModelSchema);