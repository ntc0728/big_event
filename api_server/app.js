// 用户对某个表单 ajax -> data -> 后端也会做一次校验
// 导入express
const express = require('express')
// 创建服务器的实例对象
const app = express()
// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

const path = require('path')
// 配置解析表单数据的中间件
app.use(express.urlencoded({
    extended: false
}))

// 一定要在路由之前，封装 res.cc 函数
app.use((req, res, next) => {
    // status 默认值为 1 ,表示失败的情况  传入status=0,表示成功的情况
    // err的值，可能是一个错误对象。也有可能是一个错误的描述字符串
    // 对函数参数进行结构给默认值的时候，最好最后面添加
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 一定要在路由之前配置解析 Token 的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

app.use(expressJWT({
    secret: config.jwtSecretKey
}).unless({
    path: [/^\/api\//]   // 指定哪些接口不需要进行 Token 的身份认证
}))

// 托管静态资源文件
app.use('/uploads', express.static(path.join(__dirname, './uploads')))

// 导入并注册新用户路由模块
const userRouter = require('./router/user')
// 有权限的接口，需要进行Token身份认证
app.use('/api', userRouter)
// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)
// 导入并使用文章路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

// 定义错误级别的中间件
const joi = require('@hapi/joi')
// 错误中间件 
app.use(function (err, req, res, next) {
    // 数据验证失败  0
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 身份认证失败后的结果
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败!')
    // 未知错误  
    res.cc(err)
    // next()
})

// 启动服务器
app.listen(3036, () => {
    console.log('api server running at http://127.0.0.1:3036')
})