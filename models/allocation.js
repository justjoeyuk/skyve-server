var mongoose = require('mongoose')

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * @apiDefine AllocationModel
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "abc123def456"
 *       "allocated_spaces": 2
 *       "booked_spaces": 1
 *       "bookings": [Booking, Booking...]
 *     }
 *
 */

var AllocationSchema = new Schema({
    week_start: Number,
    day: Number,
    allocated_spaces: Number,
    booked_spaces: Number,
    bookings: [{type: ObjectId, ref: 'Booking'}]
});

var Allocation = mongoose.model('Allocation', AllocationSchema);
module.exports = Allocation
