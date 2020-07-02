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

    // 点击 -> 触发事件 定时器  ajax  回调

    // 自定义校验规则
    var form = layui.form
    //通过 form.verify() 函数自定义校验规则，里面是 key：value形式，key后续对应设置到标签的 lay-verity属性中，value就是验证的规则，这里定义了两个自定义校验规则，一个是密码框，利用的是正则，一个是确认密码
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        // pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        pwd: function (value) {
            const reg = /^[\S]{6,12}$/
            if (!reg.test(value)) {
                return '密码必须6到12位，且不能出现空格'
            }
        },
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            const pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    var layer = layui.layer

    // 注册
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 箭头函数里面是没有this的，往上一级作用域里查找
        // 1. 阻止默认的提交行为
        e.preventDefault()
        // 2. 发起Ajax的POST请求
        // inputParams
        var inputParams = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        // var data = {
        //     username: $('#form_reg [name=username]').val(),
        //     password: $('#form_reg [name=password]').val()
        // }
        $.post('/api/reguser', inputParams, function (res) {
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
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            //$(this).serialize() 获取表单数据 key=value&key=value
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                // 真正的将token落地到缓存 持久化存储的地方  
                // 获取：localStorage.getItem('token', res.token)
                // 清空：localStorage.removeItem('token', res.token)
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })

})



