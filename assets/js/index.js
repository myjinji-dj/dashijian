$(function () {

    //加载layer模块
    var layer = layui.layer;
    //当点击退出时 
    //询问是否要退出
    $('.tuichu').on('click', function () {
        //询问
        //询问框
        layer.confirm('您确定要退出吗？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            // 确定代码
            // 如果确定退出 删除token  返回到登录页面
            localStorage.removeItem('token');
            location.href = '/login.html';
        }, function () {
            //取消代码

        });
    })




    //获取用户信息  用于显示在页面欢迎您之类的
    getuserInfo();

})

// 函数写在外面, 方便别的调用
function getuserInfo() {
    $.ajax({
        url: '/my/userinfo',
        success: function (res) {
            console.log(res);

        },
        // headers配置请求头
        headers: {
            // 利用请求头 Authorization取出本地存储的token
            Authorization: localStorage.getItem('token'),
        }
    })

}