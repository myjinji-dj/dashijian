

//当手动修改地址栏的地址想跳转到后台页面的时候   判断有没有token
// 需要给除了login.html 的页面 在头部区域  就引入token.js
// 如果没有token 说明没有登录 需要跳转到登录页面 login.html

if (!localStorage.getItem('token')) {
    // 取反 为空时,说明没有登录
    location.href = '/login.html';
}

