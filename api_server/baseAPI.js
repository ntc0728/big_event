// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候
// 会先调用 ajaxPrefilter 这个函数



$.ajaxPrefilter(function (options) {
    // 再发起真正的 Ajax 请求之前，同一拼接请求的根路径
    // options.url = 'http://ajax.fronted.itheima.net' + options.url
    options.url = 'http://127.0.0.1:3036' + options.url

    // 统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
})