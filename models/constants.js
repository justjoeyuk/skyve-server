/** @apiDefine AuthHeader
 * @apiHeader {String} Authorization Bearer {JWT_TOKEN}
 */

var moment = require('moment-timezone');

var Constants = {
  JWT_SECRET : "jwt_secret_328",

  getMonday : function(date) {
    date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);

    var day = date.getUTCDay(),
        diff = date.getUTCDate() - day + (day == 0 ? -6:1); // adjust when day is sunday

    return new Date(date.setUTCDate(diff)).getTime();
  }
}

module.exports = Constants
