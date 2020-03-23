$(function () {

    //切换 点击去登录切换为登录页面 隐藏注册页面
    $('#denglu').on('click', function () {
        $('.reg').hide();
        $('.login').show();
    })

    $('#zhuce').on('click', function () {
        $('.login').hide();
        $('.reg').show();
    })

    // 注册页面 验证表单
    // 使用layui内置模块的步骤
    //1. 加载表单模块
    var form = layui.form;

    //2. 使用layui表单验证
    form.verify({
        //各种自定义验证规则
        //规则名称:['验证的代码','错误提示'],
        //规则名称:function() {}

        //验证密码
        mima: [/^[\S]{6,12}$/, '密码长度6-12位'],
        //验证确认密码
        repwd: function (value) {   //value指当前使用验证规则输入框的值
            // 获取第一个密码框的值
            var pwd = $('#pwd').val().trim();
            //比较两个密码是否一致
            if (pwd != value) {
                return '两个密码不一致';
            }
        }


    })



    //--------------点击注册提交数据 注册提交事件
    // 加载 弹出框模块
    var layer = layui.layer;

    $('.resForm').on('submit', function (e) {
        e.preventDefault();
        //快速获取表单元素\
        var data = $(this).serialize();

        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: data,
            success: function (res) {
                console.log(res);
                //=1 注册失败
                if (res.status === 1) {
                    return layer.msg(res.message);
                }
                // 注册成功
                layer.msg('注册成功');
                $('#denglu').click();
            }
        })
    })




    //点击登录  利用接口验证
    $('.login-form').on('submit', function (e) {
        e.preventDefault();
        // 获取登录数据
        var data = $(this).serialize();

        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: data,
            success: function (res) {
                console.log(res);
                // =0 登录成功 本地存储token 跳转到后台数据页面
                if (res.status == 1) {
                    layer.msg(res.message);
                    return $('.login-form')[0].reset();

                }
                // 本地存储token
                localStorage.setItem('token', res.token);
                layer.msg('登录成功');
                location.href = '/index.html';

            }
        })
    })









})