$(function () {

    // 加载form模块
    var form = layui.form;

    // 调用initEditor()方法初始化富文本编辑器

    initEditor();

    // 初始化剪裁区
    var $image = $('#image');
    //配置选项 
    const options = {
        aspectRatio: 400 / 280, //纵横比
        preview: '.img-preview', //指定浏览区域
    }
    // 创建剪裁区
    $image.cropper(options);


    //当点击选择封面的时候触发文件域
    $('.select').on('click', function () {
        $('#file').click();
    })

    //当文件域发生改变时 ,找到用户选择的图片,生成一个临时的url
    $('#file').change(function () {

        //找到用户选择的图片  files是DOM的方法 不能使用$(this)
        var fileObj = this.files[0];
        //创建对应的url
        var url = URL.createObjectURL(fileObj);
        //更新剪裁区
        // 销毁剪裁区               更换图片             重新生成剪裁区
        $image.cropper('destroy').attr('src', url).cropper(options);
    })


    // 获取下拉框的分类 渲染文章类别 (ajax)
    // 获取所有的分类，并渲染
    renderCategory();
    function renderCategory() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                console.log('分类:', res);
                var strHtml = template('tpl-category', res);
                $('#category').html(strHtml);
                // 对于动态创建了select框，必须更新渲染
                form.render('select'); // 对页面中的select框从新渲染
            }
        });
    }



    // 定义变量 保存文章的发布状态
    var s = '';
    $('button:contains("发布")').click(function () {
        s = "已发布";
    })
    $('button:contains("存为草稿")').click(function () {
        s = "草稿"
    })

    // 当点击发布和存为草稿的时候
    //获取表单数据 提交到接口 渲染到文章列表页面 并跳转
    $('form').on('submit', function (e) {
        e.preventDefault();

        //使用formDate快速收集表单数据
        var fd = new FormData(this);
        fd.append('state', s);

        // 图片处理 (讲剪裁后的图片,输出为文件)
        $image.cropper('getCroppedCanvas', { //创建一个canvas画布
            width: 400,
            height: 280
        }).toBlob(function (blob) { //将canvas画布上的内容,转化为文件对象
            // 到此为止,图片剪裁完成,得到一个二进制的图片就是形参blob
            // 追加到formdata
            fd.append('cover_img', blob);

            // form中要求的参数齐了 发送请求
            $.ajax({
                type: 'POST',
                url: '/my/article/add',
                data: fd,
                // 数据为FormDate 必须包含两项配置
                processData: false,
                contentType: false,
                success: function (res) {
                    console.log(res);

                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    //发布成功 提示 并跳转
                    layer.msg(s + '成功');
                    location.href = '/article/art_list.html';
                }
            })
        })
    })





})