// 自定义和用户相关的路由处理函数， 供.router.user.js ，模块使用

// 导入数据库操作模块
const db = require('../db/index')

// 导入 bcryptjs 这个包  用来加密密码
const bcrypt = require('bcryptjs')

// 导入生成的 Token 的包
const jwt = require('jsonwebtoken')

// 导入全局的配置文件
const { jwtSecretKey, expiresIn } = require('../config')

// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    // 解构赋值  对象 格式要一致
    // 观察 -> 封装 -> 观察 status 1(出现多次，表示失败) 0(表示成功)
    // 确保用户使用封装后的函数更简单
    let { username, password } = req.body
    // const userinfo = req.body

    // 对表单中的数据，进行合法性的校验
    // if (!userinfo.username || !userinfo.password) return res.cc(err)
    //{
    // return res.send({
    //     status: 1,
    //     message: '用户名或密码不合法'
    // })
    //}
    // 定义 sql 语句，查询用户是否被占用
    const sqlStr = 'select * from my_db_01.ev_users where username=?'
    db.query(sqlStr, username, (err, results) => {
        // 执行 sql 语句  判断语句是否执行
        if (err) return res.cc(err)
        // { 
        //     return res.send({
        //         status: 1,
        //         message: err.message
        //     })
        // }
        // 判断用户名是否被占用
        if (results.length > 0) return res.cc('用户名被占用，请更换其他用户名')
        //{
        // return res.send({
        //     status: 0,
        //     message: '用户名被占用，请更换其他用户名'
        // }) 
        //}
        // TODO: 用户名可以使用
        // 调用 bcrypt.hashSync() 对密码进行处理
        password = bcrypt.hashSync(password, 10)

        // 定义插入新用户的 SQL 语句
        const sql = 'insert into my_db_01.ev_users set ?'
        db.query(sql, { username, password }, (err, results) => {
            // 判断sql 语句是否被执行
            if (err) return res.cc(err)
            //     return res.send({
            //     status: 1,
            //     message: err.message
            // })
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
            // return res.send({
            //     status: 1,
            //             message: '注册用户失败，请稍后再试！'
            // })
            // 注册用户成功
            // res.send({
            //     status: 1,
            //     message: '注册成功'
            // })
            res.cc('注册成功', 0)
        })
    })
}


// 登录的处理函数
exports.login = (req, res) => {
    // 1.接受表单数据
    let userinfo = req.body
    // const { username, password } = req.body
    //2.定义SQL语句
    const sql = `select * from my_db_01.ev_users where username=?`
    db.query(sql, userinfo.username, function (err, results) {
        // 执行sql语句失败
        if (err) return res.cc(err)
        // 执行sql语句成功。但是查询到数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败')
        // TODO:判断用户输入的登录密码是否和数据库中的密码一致

        // 拿着用户输入的密码,和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        // 如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResult) {
            return res.cc('登录失败！')
        }
        // 合并属性
        // console.log(results[0])
        // const user = { ...results[0], password: '', user_pic: '' }
        const user = Object.assign({ ...results[0], password: '', user_pic: '' })
        // 合并对象 Object.assgin 合并对象的
        // const user = Object.assign({ ...results[0], password: '', user_pic: '' })
        // 合并属性：Object.assign() 第一个参数是一个源对象，后面的属性会覆盖前面的(浅拷贝)
        // 对用户的信息进行加密，生成 Token 字符串
        const tokenStr = jwt.sign(user, jwtSecretKey, { expiresIn })
        // 调用 res.send()将 Token 响应给客户端
        res.send({
            status: 0,
            message: '登录成功',
            token: `Bearer ${tokenStr}`
            // token: 'Bearer ' + tokenStr,

        })
    })

}