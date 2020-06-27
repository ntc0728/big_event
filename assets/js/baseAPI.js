// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
// ajaxPrefilter()  过滤 用户指定预先处理Ajax参数选项的回调函数
// const baseUrl ='http://127.0.0.1' 基准路径
// `${baseUrl}/api/login`
$.ajaxPrefilter(function (options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://127.0.0.1:3036' + options.url

    // 统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            // headers 请求头配置对象
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局同一挂载 complete 回调函数
    options.complete = function (res) {

        // 在 compelte 回调函数中,可以使用res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === -1 && res.responseJSON.message === '身份认证失败') {
            // 1.强制清空 token 
            localStorage.removeItem('token')
            // 2. 强制跳转到登录页面
            location.href = '/login.html'
        }

    }

})
