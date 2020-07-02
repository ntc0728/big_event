$(function () {
    var form = layui.form

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })
    // 触发事件的写法：submit
    // $('.layui-form').submit(fn)   $('xxbtnId).on('click',fn)
    // 参数的组装：只需要 oldPwd newPwd
    // jq对象转换成dom对象   $('.layui-form')[0].reset()   dom方法 reset()清空表单 
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        const inputParams = form.val('formUserPwd')
        delete inputParams.rePwd
        // let params = $(this).serialize().split('&')
        // Params.length = 2 取前两个值
        // Params.length = 0 清空数组
        // data:params.join('&')
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: inputParams,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                // 重置表单  jq 转 dom
                $('.layui-form')[0].reset()
            }
        })
    })
})