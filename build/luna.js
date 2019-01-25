/*!
* luna.js - Provides a quick and fragmented approach to common web-side!
* git+https://github.com/yelloxing/luna.js.git
* 
* author 心叶
*
* version 2.0.1next
* 
* build Sat Jul 01 2017
*
* Copyright yelloxing
* Released under the MIT license
* 
* Date:Fri Jan 25 2019 22:02:23 GMT+0800 (GMT+08:00)
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


/**
 * 动画轮播
 * @param {function} doback 轮询函数，有一个形参deep，0-1，表示执行进度
 * @param {number} duration 动画时长，可选
 * @param {function} callback 动画结束回调，可选，有一个形参deep，0-1，表示执行进度
 * 
 * @returns {function} 返回一个函数，调用该函数，可以提前结束动画
 */
luna.animation = function (doback, duration, callback) {

    var clock = {
        //把tick函数推入堆栈
        "timer": function (tick, duration, callback) {
            if (!tick) {
                throw new Error('tick is required!');
            }
            duration = duration || luna.animation.speeds;
            var id = new Date().valueOf() + "_" + (Math.random() * 1000).toFixed(0);
            luna.animation.timers.push({
                "id": id,
                "createTime": new Date(),
                "tick": tick,
                "duration": duration,
                "callback": callback
            });
            clock.start();
            return id;
        },

        //开启唯一的定时器timerId
        "start": function () {
            if (!luna.animation.timerId) {
                luna.animation.timerId = window.setInterval(clock.tick, luna.animation.interval);
            }
        },

        //被定时器调用，遍历timers堆栈
        "tick": function () {
            var createTime, flag, tick, callback, timer, duration, passTime, needStop,
                timers = luna.animation.timers;
            luna.animation.timers = [];
            luna.animation.timers.length = 0;
            for (flag = 0; flag < timers.length; flag++) {
                //初始化数据
                timer = timers[flag];
                createTime = timer.createTime;
                tick = timer.tick;
                duration = timer.duration;
                callback = timer.callback;
                needStop = false;

                //执行
                passTime = (+new Date() - createTime) / duration;
                if (passTime >= 1) {
                    needStop = true;
                }
                passTime = passTime > 1 ? 1 : passTime;
                tick(passTime);
                if (passTime < 1 && timer.id) {
                    //动画没有结束再添加
                    luna.animation.timers.push(timer);
                } else if (callback) {
                    callback(passTime);
                }
            }
            if (luna.animation.timers.length <= 0) {
                clock.stop();
            }
        },

        //停止定时器，重置timerId=null
        "stop": function () {
            if (luna.animation.timerId) {
                window.clearInterval(luna.animation.timerId);
                luna.animation.timerId = null;
            }
        }
    };

    var id = clock.timer(function (deep) {
        //其中deep为0-1，表示改变的程度
        doback(deep);
    }, duration, callback);

    // 返回一个函数
    // 用于在动画结束前结束动画
    return function () {
        var i;
        for (i in luna.animation.timers) {
            if (luna.animation.timers[i].id == id) {
                luna.animation.timers[i].id = undefined;
                return;
            }
        }
    };

};
//当前正在运动的动画的tick函数堆栈
luna.animation.timers = [];
//唯一定时器的定时间隔
luna.animation.interval = 13;
//指定了动画时长duration默认值
luna.animation.speeds = 400;
//定时器ID
luna.animation.timerId = null;

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


    return luna;

});
