// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
// ajaxPrefilter()  过滤 用户指定预先处理Ajax参数选项的额回调函数
// const baseUrl ='http://127.0.0.1' 基准路径
// `${baseUrl}/api/login`
$.ajaxPrefilter(function (options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://127.0.0.1:3036' + options.url
})