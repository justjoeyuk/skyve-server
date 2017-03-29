var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var Booking = require('../models/booking')

/**
 * @apiDefine UserModel
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "abc123def456"
 *       "email": "test@apposing.co.uk",
 *       "token": "{JWT_TOKEN}"
 *     }
 *
 */

var UserSchema = new Schema({
    email: String,
    token: String,
    pwd: { type: String, select: false }
});


var User = mongoose.model('User', UserSchema);
module.exports = User
