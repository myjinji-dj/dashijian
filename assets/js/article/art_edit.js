$(function () {

    var form = layui.form;
    // 初始化富文本编辑器
    initEditor()

    //渲染下拉框分类数据 (模板引擎) 获取文章分类
    getcategory();
    function getcategory() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                // if (res.status !== 0) {
                //     return layer.msg('获取分类信息失败')
                // }
                var strHtml = template('art-category', res);
                $('#category').html(strHtml);
                //因为是动态添加的下拉框 需要更新渲染
                form.render('select');
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('.select').on('click', function () {
        $('#file').click();
    })

    $('#file').change(function () {
        var fileObj = this.files[0];
        var newImg = URL.createObjectURL(fileObj);
        $image.cropper('destroy').attr('src', newImg).cropper(options);

    })


    //获取地址栏的id 
    var params = new URLSearchParams(location.search);
    var id = params.get('id');
    // console.log(id);

    // 获取详细信息
    $.ajax({
        url: '/my/article/' + id,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章失败');
            }
            //获取成功  数据渲染到表单
            //form. val(表单, 对象数据)
            form.val('f1', res.data);
            // 获取当前文章图片的url 
            var picUrl = 'http://www.liulongbin.top:3007' + res.data.cover_img;
            //剪裁区换为当前文章的图片
            $image.cropper('destroy').attr('src', picUrl).cropper(options);
        }
    })




    // 当点击发布或提交时  保存状态
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
        // console.log(111);

        //使用formDate快速收集表单数据
        var fd = new FormData(this);
        fd.append('state', s);
        fd.append('Id', id);
        // console.log(fd);


        // 图片处理 (讲剪裁后的图片,输出为文件)
        $image.cropper('getCroppedCanvas', { //创建一个canvas画布
            width: 400,
            height: 280
        }).toBlob(function (blob) { //将canvas画布上的内容,转化为文件对象
            // 到此为止,图片剪裁完成,得到一个二进制的图片就是形参blob
            // 追加到formdata
            fd.append('cover_img', blob);

            // form中要求的参数齐了 更改
            $.ajax({
                type: 'POST',
                url: '/my/article/edit',
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