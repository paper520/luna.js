/**
 * 浏览器端使用
 * 支持npm管理 + 浏览器直接引入
 */
(function (global, factory) {

    'use strict';

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory();
    } else {
        global.luna = factory();
    }

})(typeof window !== "undefined" ? window : this, function (undefined) {

    'use strict';

    var luna = {};

    // @CODE build.js inserts compiled luna.js here

    return luna;

});
