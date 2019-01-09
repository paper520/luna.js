/*!
* luna.js - Provides a quick and fragmented approach to common web-side!
* git+https://github.com/yelloxing/luna.js.git
* 
* author 心叶
*
* version 1.2.0next
* 
* build Sat Jul 01 2017
*
* Copyright yelloxing
* Released under the MIT license
* 
* Date:Wed Jan 09 2019 11:22:43 GMT+0800 (GMT+08:00)
*/
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

    // 字符串html变成dom结点
// 该方法不支持svg等特殊标签
var _string_to_dom = function (html_string) {
    var frameDiv = document.createElement("div");
    frameDiv.innerHTML = html_string;
    return frameDiv.childNodes[0];
};

// 判断是不是一个结点
var _is_dom = function (dom) {
    return (dom && (dom.nodeType === 1 || dom.nodeType === 11 || dom.nodeType === 9));
};  
luna.clipboard_copy = function (text, callback, errorback) {
    if (_is_dom(text)) text = text.innerText;

    // 初始化准备好结点和数据
    var random = (Math.random() * 10000).toFixed(0),
        body = document.getElementsByTagName('body')[0],
        textarea = _string_to_dom('<textarea id="luna-clipboard-textarea-' + random + '" style="position:absolute">' + text + '</textarea>');

    // 添加到页面
    body.insertBefore(textarea, body.childNodes[0]);

    // 执行复制
    document.getElementById("luna-clipboard-textarea-" + random).select();
    try {
        var result = window.document.execCommand("copy", false, null);

        if (result) {
            if (!!callback) {
                callback();
            }
        } else {
            if (!!errorback) {
                errorback();
            }
        }

    } catch (e) {
        if (!!errorback) {
            errorback();
        }
    }

    // 结束后删除
    body.removeChild(document.getElementById("luna-clipboard-textarea-" + random));
};

    luna.version = '1.2.0next';
    luna.author = '心叶';

    return luna;

});
