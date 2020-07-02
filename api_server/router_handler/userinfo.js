// 导入数据库操作模块
const db = require('../db/index')


// 导入处理密码的模块
const bcryptjs = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // user  解构赋值
    // 正式在用token解析出来的属性
    // const { id: userId } = req.user
    // 定义查询用户信息的 SQL 语句
    // 为了防止用户的密码泄露，需要排除 password 字段
    const sql = 'select id ,username,nickname,email,user_pic from my_db_01.ev_users where id=?'
    // 调用 db.query()  执行 SQL 语句   //身份认证成功，req会加载user这个属性 
    db.query(sql, req.user.id, (err, results) => {
        // 执行sql 语句失败
        if (err) return res.cc(err)
        // 执行sql语句成功，但是查询的结果可能为空
        if (results.length !== 1) return res.cc('获取用户信息失败!')

        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取用户信息成功',
            data: results[0]
        })
    })
}

// 更新用户的基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    //定义待执行的SQL语句
    const sql = 'update ev_users set? where id=?'
    // const sql = 'update ev_users set username=?,password=? where id=?'
    // 调用db.query()执行sql语句并传参
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行 sql 语句失败
        if (err) return res.cc(err)

        // 执行 sql 语句成功，但影响行数不为1
        if (results.affectedRows !== 1) return res.css('修改用户基本信息失败')

        // 修改用户信息成功
        return res.cc('修改用户基本信息成功', 0)
    })
}

// 重置密码的处理函数
exports.updatePassword = (req, res) => {
    // 定义根据id查询用户数据的sql语句
    const sql = 'select * from ev_users where id=?'
    // 执行sql语句查询用户是否存在
    db.query(sql, req.user.id, (err, results) => {
        //执行sql语句失败
        if (err) return res.cc(err)

        // 检查指定 id 的用户是否存在
        if (results.length !== 1) return res.cc('用户不存在')

        // TODO:判断提交的旧密码是否正确    oldPwd post请求通过登录产生的token从req.body获取到     执行sql语句成功后从数据获取到相关id的密码
        const compareResult = bcryptjs.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('旧密码错误')

        // TODO:更新数据库中的密码

        // 定义更新用户密码的sql语句
        const sql = 'update ev_users set password =? where id=?'

        // 对新密码进行 bcrypt 加密处理
        const newPwd = bcryptjs.hashSync(req.body.newPwd, 10)

        // 对密码进行 bcrypt 加密处理
        db.query(sql, [newPwd, req.user.id], (err, results) => {

            // sql 语句执行失败
            if (err) return res.cc(err)

            // sql 语句执行成功，但是影响行数不等于1
            if (results.affectedRows !== 1) return res.cc('更新密码失败')

            // 更新密码成功
            res.cc('更新密码成功!', 0)
        })
    })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    // 定义更新用户头像的sql语句
    const sql = 'update ev_users set user_pic=? where id=?'

    // 执行sql语句，更新对应用户的头像
    db.query(sql, [req.body.user_pic, req.user.id], (err, results) => {
        // 执行sql语句
        if (err) return res.cc(err)

        // 执行sQL语句成功，但是影响行数不等于1
        if (results.affectedRows !== 1) return res.cc('更新头像失败')

        // 更新用于头像成功
        return res.cc('更新头像成功', 0)
    })
}