/** @apiDefine AuthHeader
 * @apiHeader {String} Authorization Bearer {JWT_TOKEN}
 */

var moment = require('moment-timezone');

var Constants = {
  JWT_SECRET : "jwt_secret_328",

  getMonday : function(date) {
    var day = date.getUTCDay() || 7;
    if( day !== 1 )
        date.setUTCHours(-24 * (day - 1));
        date.setUTCMinutes(0)
        date.setUTCSeconds(0)
        date.setUTCMilliseconds(0)
    return date;
  }
}

module.exports = Constants
