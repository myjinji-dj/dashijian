$(function () {

    var laypage = layui.laypage;
    var form = layui.form;

    // 先获取文章列表的请求参数
    var queryObj = {
        pagenum: 1,  //页码值,默认显示第1页
        pagesize: 2, //每页显示多少条数据
        cate_id: '',//可选参数 文章分类的id
        state: '',//可选 文章状态  已发布/草稿
    }

    // 当点击文章列表时 ,获取文章数据渲染到页面
    renderHtml();
    function renderHtml() {
        $.ajax({
            url: '/my/article/list',
            data: queryObj,
            success: function (res) {
                // console.log(res);
                // if (res.status !== 0) {
                //     return layer.msg(res.message);
                // }
                // 获取成功渲染数据 template 渲染 (因为html中用的是模板
                var str = template('art_dataList', res);   // !!!!!!!!!数据 res 
                //追加到tbody中
                // console.log(str);
                $('tbody').html(str);

            }
        })
    }


    // template的过滤器处理时间 processTime
    template.defaults.imports.processTime = function (t) {
        var d = new Date(t);// 把t传入 根据传入的时间,创建对应的时间对象d

        var year = d.getFullYear();
        var month = addZero(d.getMonth() + 1);
        var date = addZero(d.getDate());
        var hour = addZero(d.getHours());
        var minute = addZero(d.getMinutes());
        var second = addZero(d.getSeconds());
        return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
    }
    //补0 函数
    function addZero(n) {
        return n < 10 ? '0' + n : n;
    }


    // 完成搜索功能
    $('form').on('submit', function (e) {
        e.preventDefault();
        var searchParams = $(this).serializeArray();
        console.log(searchParams);
        // 重置获取文章列表时的请求参数
        queryObj.cate_id = searchParams[0].value;
        queryObj.state = searchParams[1].value;
        // 从新渲染列表
        renderArticleList();
    })

    // 获取文章列表，并渲染到页面中
    renderArticleList();
    function renderArticleList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: queryObj,
            success: function (res) {
                console.log(res);
                // 通过模板引擎渲染结果到页面
                var strHtml = template('art_dataList', res);
                $('tbody').html(strHtml);
                // 数据列表渲染成功，然后调用分页函数
                showPage(res.total);
            }
        });
    }




    // 当点击删除时 先询问 再通过id判断删除哪个
    // 因为是动态添加的 需要事件委托的方式注册
    $('body').on('click', '.del-art', function () {

        // 获取id (通过删除按钮上面的data-id属性获取)
        var id = $(this).attr('data-id');
        //询问
        //询问框
        layer.confirm('您确定删除吗', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            // 确定的话 发起ajax请求
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    // 重新渲染页面 调用
                    renderHtml();
                }
            })
            layer.msg('删除文章成功!', { icon: 1 });
        }, function () {
            // 取消 什么都不做
        });
    })



    // 点击编辑时 跳转到edit页面 (类似publish)
    $('body').on('click', '.editor', function () {
        //获取事件 源的data-id属性 !!!!!!!!!!!!!!1
        var id = $(this).attr('data-id');
        location.href = '/article/art_edit.html?id=' + id;
    })


    // 获取类别渲染到数据
    getcategory();
    function getcategory() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                var strHtml = template('tpl-cateory', res);
                $('#category').html(strHtml);
                // 动态创建的select 需要用form.render
                form.render('select');
            }
        })
    }


    // 定义分页的函数
    function showPage(c) {
        laypage.render({
            elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
            count: c, //数据总数，从服务端得到
            curr: queryObj.pagenum, // 默认显示第几页
            limit: 2, // 每页显示多少条
            layout: ['prev', 'page', 'next', 'limit', 'skip'],
            limits: [2, 3, 4, 5, 10],
            // jump是一个事件。（事件的特点是，不触发不会执行）
            // 点击页码的时候，jump事件会触发
            jump: function (obj, first) {
                // 参数obj，就是上面的基础参数（elem/count/curr/....）
                // console.log(first); // first开始是true，再次点击页面的时候是undefined
                //首次不执行
                // 重新设置请求参数，然后从新渲染页面
                if (!first) {
                    //do something
                    queryObj.pagenum = obj.curr;
                    queryObj.pagesize = obj.limit;
                    renderArticleList();
                }
            }
        });
    }


})