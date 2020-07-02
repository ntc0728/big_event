$(function () {
    //调用getUserInfo
    getUserInfo()

    var layer = layui.layer

    // 点击按钮实现退出功能
    $('#btnLogout').on('click', function () {
        // 提示用户是否退出
        // 第 3 个参数，点击确定 执行的回调函数
        // 第 4 个参数 点击取消 执行的回调函数

        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {

            // 1.清空本地存储中的 token 
            localStorage.removeItem('token')
            // 2. 重新跳转到登录页面
            location.href = '/login.html'
            //  3.关闭 confirm 询问框
            layer.close(index);
        }, function () {
            console.log('ok')
        });
    })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // headers 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {


                return layui.layer.msg(res.message)
            }
            // console.log(res.data);
            //调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
        // 不论成功还是失败，最终都会调用 complete 回调函数  (判断有没有登录)
        // complete: function (res) {
        //     // 在 compelte 回调函数中,可以使用res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
        //         // 1.强制清空 token 
        //         localStorage.removeItem('token')
        //         // 2. 强制跳转到登录页面
        //         location.href = '/login.html'
        //     }

        // }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.按需渲染用户的头像
    // !user.user_pic
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //3.2渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}