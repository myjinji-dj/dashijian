$(function () {


    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')

    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,

        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    //2 当点击上传图片时 ,触发file 
    $('#select').on('click', function () {
        $('#file').click();

    })

    // 3. 更换图片 
    // 当file 发送改变时 获取选择的图片
    $('#file').change(function () {
        // console.dir(this.files);

        if (this.files.length <= 0) {
            return layer.msg('请选择图片');
        }
        // 获取文件对象
        var filesObj = this.files[0];

        // 得到选择图片的临时url
        // URL 是js内置对象
        // 根据文件对象创建一个新的url
        var url = URL.createObjectURL(filesObj);

        // 设置剪裁区的src 为url
        $image.cropper('destroy').attr('src', url).cropper(options)
        // cropper('destroy') 销毁旧裁剪区 
        // attr('src', url) 重新设置图片src
        // cropper(options) 重新初始化裁剪区域

    })


    // 4. 点击确定上传的时候 
    $('#change').on('click', function () {
        var canvas = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        });
        // 图片转化为url
        // aaa是base64格式的图片,是字符串
        var aaa = canvas.toDataURL();

        // 发送请求 更换头像
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: { avatar: aaa },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                // 成功重新渲染头像
                layer.msg('更换成功');
                // 依然调用 getuserInfo()
                window.parent.getuserInfo();

            },
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
    })


})