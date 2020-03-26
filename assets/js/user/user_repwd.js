
var form = layui.form;
var layer = layui.layer;

$(function () {


    // 验证表单
    form.verify({
        len: [/^[\S]{6,12}$/, '密码长度必须6-12位'],
        diff: function (value) {
            var oldpwd = $('input[name="oldPwd"]').val();
            if (oldpwd == value) {
                return '新旧密码不能一致'
            }
        },
        same: function (value) {
            var newpwd = $('input[name="newPwd"]').val();
            if (newpwd !== value) {
                return '两次密码不一样';
            }
        }

    })

    // 点击修改 给表单注册提交表单事件 获取数据 通过接口 
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        var data = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: data,
            success: function (res) {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('修改成功');
                $('.layui-form')[0].reset(); s

            }
        })
    })































    // //表单验证
    // form.verify({
    //     // 验证长度
    //     len: [/^[\S]{6,12}$/, '密码长度必须是6-12位'],

    //     // 新密码不能与旧密码一致
    //     diff: function (value) { //value指当前加入diff 的元素值
    //         var oldpwd = $('input[name="oldPwd"]').val();
    //         if (oldpwd == value) {
    //             return '新密码不能与旧密码一致';
    //             // layer.msg('新密码不能与旧密码一致')
    //             // return layer.msg('新密码不能与旧密码一致');
    //         }
    //     },
    //     // 确认密码和新密码 两次输入是否一致
    //     same: function (value) {   //value指确认新密码
    //         var newpwd = $('input[name="newPwd"]').val();
    //         if (value !== newpwd) {
    //             return '两次密码不一致'
    //         }
    //     }
    // }),



    //     // 点击修改密码时 ,提交事件 获取表单更改的数据 
    //     $('.layui-form').on('submit', function (e) {
    //         e.preventDefault();
    //         var data = $(this).serialize();

    //         // 重置密码
    //         $.ajax({
    //             type: 'POST',
    //             url: '/my/updatepwd',
    //             data: data,
    //             success: function (res) {
    //                 // console.log(res);
    //                 if (res.status !== 0) {
    //                     // 修改失败
    //                     return layer.msg(res.message);
    //                 }
    //                 // 成功 
    //                 layer.msg('修改成功');
    //                 // 重置输入框
    //                 $('.layui-form')[0].reset();

    //             }
    //         })
    //     })





})