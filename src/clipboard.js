/**
 * 复制文本到剪切板
 * @param {string / dom} text 需要复制的字符串或结点（如果是结点，复制的是结点的innerText）
 * @param {function} callback 正确回调
 * @param {function} errorback 错误回调
 */
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
