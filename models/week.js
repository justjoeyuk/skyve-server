var mongoose = require('mongoose')

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * @apiDefine WeekModel
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "abc123def456"
 *       "spaces_avaliable": 8
 *       "allocations": [Allocation x 7]
 *     }
 *
 */

var WeekSchema = new Schema({
    start_time: Number,
    spaces_avalible: Number,
    allocations: [{type: ObjectId, ref: 'Allocation'}]
});

var Week = mongoose.model('Week', WeekSchema);
module.exports = Week
