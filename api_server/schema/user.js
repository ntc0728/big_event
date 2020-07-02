// 导入定义验证规则的包
const joi = require('@hapi/joi')
const expressJoi = require('@escook/express-joi')
// 要对某一个路由进行添加验证规则 -> 局部中间件
/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */


// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()   // required 必填
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

// 定义id,nickname,email 的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()
const user_pic = joi.string().dataUri().required()

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
    body: {
        username,
        password,
    }
}

// 验证规则对象 - 更新用户基本信息
exports.update_userinfo_schema = {
    // req.body.id nickname
    // params:{} query:{}
    body: {
        id,
        nickname,
        email,
        // username: joi.string()
    }
}

// 验证规则对象 -更新密码
exports.update_password_schema = {
    body: {
        // 使用 password 这个规则，验证 req.body.oldPwd 的值
        oldPwd: password,
        // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
        // 解读：
        // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
        // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
        // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
        // ref 一般表示引用 
        //     joi.not(joi.ref('oldPwd')).concat(password)
    }   //    新密码的值不能与旧密码的值一样    新密码的规则与旧密码的格则一样
}

// 验证规则对象 - 更新头像
exports.update_avatar_schema = {
    body: {
        user_pic,
    }
}