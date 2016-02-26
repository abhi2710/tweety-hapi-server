/**
 * Created by harekamsingh on 1/31/16.
 */
var sampleJson = require('./Config/sample.json');
var async = require('async');
var log4js = require('log4js');
var logger = log4js.getLogger('[Bootstrap]');
var DaoManager = require('./service/DAOmanager');
//var constants = require('./Config/constants');
var models = require('./models');
function addSampleDataInDb(sampleData, callbackParent) {
    var taskToRunInParallel = [];
    sampleData.forEach(function (dataObj) {
        taskToRunInParallel.push((function (dataObj) {
            return function (embeddedCB) {
                addData(dataObj, embeddedCB);
            }
        })(dataObj));
    });
    async.parallel(taskToRunInParallel, function (error) {
        if (error)
            return callbackParent(error);
        return callbackParent(null);
    });

}
function init() {
    addSampleDataInDb(sampleJson, function (error) {
        if (error)
            logger.error(error);
    })
}
function addData(data, callbackParent) {
    var isSkip = false;
    async.waterfall([
            function (callback) {
                DaoManager.getData(models.users, {_id: data._id}, {_id: 1}, {limit: 1, lean: true}, callback);
            },
            function (result, callback) {
                if (result && result.length > 0) {
                    isSkip = true;
                    return callback(data._id + " already exists");
                }
             //   data.location = {type: constants.GEO_JSON_TYPES.Point, coordinates: [data.longitude, data.latitude]};
                data.dateCreated= new Date(data.dateCreated.replace(" -06:-30", "").trim()).toISOString();
                //var balance = data.balance;
             //   balance = balance.substring(1, balance.length);
              //  var commaSep = balance.split(",");

               // var properstr = "";
               // for (var i = 0; i < commaSep.length; i++) {
               //     properstr += commaSep[i];
               // }
               // data.balance = parseFloat(properstr);
                DaoManager.setData(models.users,data, callback);

            }
        ],
        function (error, result) {
            if (!isSkip) {
                if (error)
                    logger.error(error);
                else
                    logger.info(result._id);
            }
            return callbackParent(null);
        }
    )
}
module.exports.init = init;