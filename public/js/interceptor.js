function invoke(func, funcArgs) {

    let funcArgArray = new Array();
    for (let i = 0; i < funcArgs.length; i++) {
        funcArgArray.push(funcArgs[i]);
    }

    return func.apply(null, funcArgArray);

}

/**
 * 等待openid的拦截器
 * @param originalFunction
 * @returns {function(): Promise<any>}
 */
let waitOpenIdInterceptor = function(originalFunction) {
    let interceptor = function() {
        let preHandlePromise = new Promise((resolve, reject) => {
            let userInfo = wx.getStorageSync("openid");
            if (!!userInfo) {
                resolve();
            } else {
                let tryTime = 0;
                let interval = setInterval(function() {
                    console.log(tryTime);
                    userInfo = wx.getStorageSync("openid");
                    if (!!userInfo) {
                        resolve();
                        clearInterval(interval);
                    } else {
                        tryTime++;
                        if (tryTime > 10) {
                            clearInterval(interval);
                            reject("获取openid失败");
                        }
                    }
                }, 500);
            }
        });
        return new Promise((resolve, reject) => {
            preHandlePromise.then(res => {
                invoke(originalFunction, arguments).then(res => {
                    resolve(res);
                }, res => {
                    reject(res);
                });
            }, res => {
                reject(res);
            });
        });

    };
    return interceptor;
};
//用法
//you_function = interceptor.waitUserInfoInterceptor(you_function);



module.exports = {
    waitOpenIdInterceptor: waitOpenIdInterceptor
};
