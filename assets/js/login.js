$(function () {
    // 点击"去注册账号"的链接
    $('#link_reg').on('click', function () {
        // 阻止a标签默认跳转
        // e.preventDefault()
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击"去登录"的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
})


// 自定义校验规则
var form = layui.form
//通过 form.verify() 函数自定义校验规则，里面是 key：value形式，key后续对应设置到标签的 lay-verity属性中，value就是验证的规则，这里定义了两个自定义校验规则，一个是密码框，利用的是正则，一个是确认密码
form.verify({
    // 自定义了一个叫做 pwd 校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 校验两次密码是否一致的规则
    repwd: function (value) {
        // 通过形参拿到的是确认密码框中的内容
        // 还需要拿到密码框中的内容
        // 然后进行一次等于的判断
        // 如果判断失败,则return一个提示消息即可
        var pwd = $('.reg-box [name=password]').val()
        if (pwd !== value) {
            return '两次密码不一致！'
        }
    }
})

var layer = layui.layer

// 注册
// 监听注册表单的提交事件
$('#form_reg').on('submit', function (e) {
    // 1. 阻止默认的提交行为
    e.preventDefault()
    // 2. 发起Ajax的POST请求
    var data = {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val()
    }
    $.post('http://ajax.frontend.itheima.net/api/reguser', data, function (res) {
        if (res.status !== 0) {
            return layer.msg(res.message)
        }
        layer.msg('注册成功，请登录！')
        // 模拟人的点击行为
        $('#link_login').click()
    })
})

//登录
// 监听登录表单的提交事件
$('#form_login').submit(function (e) {
    // 阻止默认提交行为
    e.preventDefault()
    $.ajax({
        url: 'http://ajax.frontend.itheima.net/api/login',
        method: 'POST',
        // 快速获取表单中的数据
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('登录失败！')
            }
            layer.msg('登录成功！')
            // 将登录成功得到的 token 字符串，保存到 localStorage 中
            localStorage.setItem('token', res.token)
            // 跳转到后台主页
            location.href = '/index.html'
        }
    })
})

// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = 'http://ajax.frontend.itheima.net' + options.url
})
