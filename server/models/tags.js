// Tag Document Schema definition
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagsModelSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

tagsModelSchema
.virtual('url')
.get(function () {
  return ' posts/tag/' + this._id;
});

var tagsModel = mongoose.model('tagsModel', tagsModelSchema); // Compile model with schema
module.exports = tagsModel;
