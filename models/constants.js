/** @apiDefine AuthHeader
 * @apiHeader {String} Authorization Bearer {JWT_TOKEN}
 */

var Constants = {
  JWT_SECRET : "jwt_secret_328",

  getMonday : function(date) {
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    var day = date.getDay(),
        diff = date.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  }
}

module.exports = Constants
