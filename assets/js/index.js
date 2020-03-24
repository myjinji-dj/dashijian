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
            // 判断是否获取成功  
            if (res.status !== 0) {
                return layer.msg(res.message);
            }

            //获取数据成功 渲染页面  ( render渲染
            render(res.data)

        },
        // 设置用户没有登录不允许访问后台页面
        complete: function (xhr) {
            console.log(xhr);
            if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === "身份认证失败！") {
                // 如果身份认证失败,表示没有登录
                // 立即跳转到登录页面
                location.href = '/login.html';
            }
        },

        // headers配置请求头
        headers: {
            // 利用请求头 Authorization取出本地存储的token
            Authorization: localStorage.getItem('token'),
        }
    })

}


// 获取到的登录信息  渲染页面
function render(data) {

    // 把获取到的信息渲染到 页面 
    // 1.渲染用户名称 把html中name的值改为与参数一致
    var name = data.nickname || data.username;
    console.log(name);

    // 获取第一个首字母 转为大写
    var firstText = name.substr(0, 1).toUpperCase();
    // 2.渲染头像 判断是否有自己的头像没有头像用字体头像
    if (data.user_pic) {
        //如果有头像,显示头像,隐藏字体头像
        $('#porsen img').show().attr('src', data.user_pic);
        $('.text-info').hide();
    } else {
        //没有头像,显示字体头像
        $('.text-info').css('display', 'inline-block').text(firstText);
        $('#porsen img').hide();
    }
    // 3.渲染欢迎语  (+name)
    $('.wc').html('欢迎&nbsp;&nbsp;' + name);


}