var ScaleBaseModel = require('./ScaleBaseModel');

module.exports = ScaleBaseModel.extend({

    prefix: "#/uxc-scale/",
    urlRoot: "/api/v1/uxc-scale/",

    toString: function(){
        return "UXC Scale";
    }

});
