$.ajaxPrefilter(function (option) {
    // option 是每次ajax请求时配置的参数

    // console.log(option);

    // 配置统一的url地址
    option.url = 'http://www.liulongbin.top:3007' + option.url;


    //请求的url为/my/开头的,需要进行两项配置 
    // 配置 complete 进行判断是否是假token
    // 统一配置token

    // indexOf !==-1时 ,就是存在my        // -1 不存在
    if (option.url.indexOf('/my/') !== -1) {
        // 如果懂计算机的会手动在浏览器工具配置一个假token,就存在了token 
        //这时的token.js 只能判断有或没有, 不能阻止判断 假token
        // 
        // 配置complete配置项
        option.complete = function (xhr) {
            // console.log('xhr=', xhr);   //responseJSON: {status: 1, message: "身份认证失败！"}
            if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
                //身份认证失败  移除假token
                localStorage.removeItem('token');
                // 返回登陆页面
                location.href = '/login.html';
            }
        }


        // 判断如果接口以my开头,需要携带token 就统一配置token
        option.headers = {
            Authorization: localStorage.getItem('token')
        }
    }
})