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