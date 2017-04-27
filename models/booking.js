var mongoose = require('mongoose')

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * @apiDefine BookingModel
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "abc123def456"
 *       "user": "ObjectId"
 *       "start_time": 1490788800
 *     }
 *
 */

var BookingSchema = new Schema({
    _user: { type: ObjectId, ref: 'User' },
    allocation_id: { type: ObjectId, ref: 'Allocation' }
});

var Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking
