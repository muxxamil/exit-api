'use strict';

let helperService = {};

helperService.replaceStringValues = (content, values) => {

    values.forEach(function (value) {

        let regex = /(,)(?=[^]*[^\s])/g;
        regex = regex.source;
        regex = regex.replace(',', value.name);
        regex = new RegExp(regex, "g");

        content = content.replace(regex, value.value);
    });
    return content;
};

module.exports = helperService;