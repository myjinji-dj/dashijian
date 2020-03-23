$.ajaxPrefilter(function (option) {
    // option 是每次ajax请求时配置的参数

    console.log(option);

    // 配置统一的url地址
    option.url = 'http://www.liulongbin.top:3007' + option.url;
})