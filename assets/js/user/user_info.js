//  基本资料

// 加载form模块
var form = layui.form;

$(function () {

    // 1.调用函数 获取用户信息  渲染到页面(表单)
    initUserInfo()


    // 2.当点击提交按钮时 提交事件
    // 获取修改后的值 渲染到页面
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        // 获取表单的值
        var data = $(this).serialize();
        // console.log(data);  id=68&username=xiaofang&nickname=shab&email=74234989230%40qq.com
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 获取修改后的值成功 重新渲染页面
                window.parent.getuserInfo();


            },
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })

    })

    // 3. 点击重置按钮时 , 把修改的操作重置为原来的样子
    // 阻止清空输入框 (默认行为) ,再重新获取并渲染表单数据 调用inituserinfo 
    $('#reset').on('click', function (e) {
        e.preventDefault();
        // 重新渲染数据还原默认
        initUserInfo();
    })



})




// 获取用户信息,渲染到页面 (点开基础资料后获取到的数据渲染到表单)
function initUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        success: function (res) {
            console.log(res);

            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            // 获取成功渲染到页面 渲染的是侧边栏上欢迎语 后面的用户名称 
            // 使用layui渲染数据   数据为返回的 res.data !!
            form.val('formValue', res.data)

        },
        headers: {
            Authorization: localStorage.getItem('token')
        }
    })
}