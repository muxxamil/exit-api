const defaults              = require('../../config/defaults');
module.exports = (model) => {

    model.getRawParams = function (params) {

        let rawParams = {};

        for (var modelAttribute in model.rawAttributes) {

            if (params[modelAttribute] !== null && params[modelAttribute] !== undefined) {

                rawParams[modelAttribute] = params[modelAttribute];
            }
        }
        return rawParams;
    }

    model.setPagination = (params) => {

        let response        = {};
        if(!params.all) {
          let page            = params.page ? (parseInt(params.page)) : defaults.page;
    
          response.limit       = parseInt( params.pageLimit || defaults.resultSetLimit );
          response.offset      = (page * response.limit);
        }
    
        return response;
    };
};
