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