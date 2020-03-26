
$(function () {
    // 加载form 模块
    var form = layui.form;

    // 定义添加弹出层的索引
    var addIndex = null;

    // 定义编辑弹出层的索引
    var editIndex = null;


    //获取后台数据(文章分类列表)渲染到tbody
    getcategory()
    function getcategory() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                // 获取失败
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 获取成功 渲染到页面(template)
                var renderHtml = template('tpl-category', res);
                // 追加到tbody中
                $('tbody').html(renderHtml);
            }
        })
    }


    //当点击添加类别的时 弹出 弹出框
    $('#addBtn').on('click', function () {
        // 弹出层的open 核心方法!!!  
        addIndex = layer.open({
            type: 1,   //type 是弹出层的类型 1为页面层
            title: '添加文章分类',
            //content的内容为 html中添加的script模板
            content: $('#add-article').html(),  //content里面可写html  DOM 元素 和字符串
            area: ['500px', '250px'],  //弹出层的宽高
        });
    })


    // 点击确认添加时,获取表单元素 依照接口 渲染到页面

    // 错误代码 ------注册失败不会提交  因为表单是动态添加的 要以事件委托的方式进行注册
    // $('#artAdd-form').on('submit', function (e) {
    //     e.preventDefault();
    //     var data = $(this).serialize();
    //     console.log(data);
    // })

    $('body').on('submit', '#artAdd-form', function (e) {
        e.preventDefault();

        // var data = $(this).serialize();
        // console.log(data);    可省略 直接写在ajax里

        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 获取成功 提示 清空弹窗 渲染到页面
                layer.msg('添加成功');
                layer.close(addIndex);
                //  调用getcategory() 渲染到页面
                getcategory()
            }
        })

    })



    // 当点击编辑按钮时 创建编辑弹出层 (委托注册!!!!!)
    $('body').on('click', '#edit', function () {

        //点击编辑时获取当前点击数据 (在编辑的按钮上添加了自定义属性 data-  )
        //可使用了h5提供的属性 dataset 一次性把标签上的data-xxx数据全部获取到
        var shuju = this.dataset;
        // console.log(shuju);  //DOMStringMap {id: "1", name: "最新", alias: "ZuiXin"}


        editIndex = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#edit-article').html(),  //content 模板id名
            area: ['500px', '250px'],
            // layer.open 方法里有success这个参数
            success: function () {
                // 等弹层成功之后,触发
                // form.val给表单赋值 
                form.val('f1', JSON.parse(JSON.stringify(shuju)));
                //shuju 是构造函数出来的对象不能直接使用 需要转换 ↑
            }
        })
    })


    // 当点击确认修改时,给表单设置提交事件, 并重新获取并渲染到页面
    $('body').on('submit', '#edit-form', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 更新成功 提示 清空提示层
                layer.msg('修改成功');
                layer.close(editIndex);
                // 重新渲染页面
                getcategory()
            }
        })
    })




    // 当点击删除时 ,删除元素不能设置id 因为是循环渲染的不能出现相同的id
    $('body').on('click', '.del', function () {
        // 先询问确定要删除吗
        var that = $(this);
        //询问框                                           index指的是这个删除弹层的索引
        layer.confirm('删除?', { icon: 3, title: '提示' }, function (index) {
            //确定 执行代码
            // 获取当前id
            var id = that.attr('data-id');
            $.ajax({
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    // 删除成功 重新渲染 提示删除成功
                    layer.msg('删除成功');
                    getcategory();
                }
            })
            // 移除弹框 
            layer.close(index);
        });


    })


})