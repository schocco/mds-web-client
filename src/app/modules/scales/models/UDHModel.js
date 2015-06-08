var ScaleBaseModel = require('./ScaleBaseModel');

module.exports = ScaleBaseModel.extend({

    prefix: "#/udh-scale/",
    urlRoot: "/api/v1/udh-scale/",

    toString: function(){
        return "UDH Scale";
    }

});
