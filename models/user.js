var mongoose = require('mongoose')

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * @apiDefine UserModel
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "abc123def456"
 *       "email": "test@apposing.co.uk",
 *       "first_name": "John",
 *       "last_name": "Smith",
 *       "profile_image": "{IMG_URL}",
 *       "token": "{JWT_TOKEN}",
 *       "acc_type" : "admin|worker"
 *     }
 *
 */

var UserSchema = new Schema({
    email: String,
    first_name: String,
    last_name: String,
    profile_image: String,
    token: String,
    acc_type: String,
    manager: ObjectId,
    pwd: { type: String, select: false }
});


var User = mongoose.model('User', UserSchema);
module.exports = User
