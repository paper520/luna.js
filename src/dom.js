/**
 * 获取一个结点的全部样式
 * @param {dom} dom 被操作的结点
 * @param {string} name 属性名称，可选，如果填了，只反对对应的属性值
 */
luna.dom_styles = function (dom, name) {
    if (!_is_dom(dom)) {
        throw new Error('DOM is required!');
    }
    if (document.defaultView && document.defaultView.getComputedStyle) {
        if (name && typeof name === 'string') {
            return document.defaultView.getComputedStyle(dom, null).getPropertyValue(name); //第二个参数是伪类
        } else {
            return document.defaultView.getComputedStyle(dom, null);
        }
    } else {
        if (name && typeof name === 'string') {
            return dom.currentStyle.getPropertyValue(name);
        } else {
            return dom.currentStyle;
        }
    }
};