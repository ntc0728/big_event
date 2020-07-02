// 导入数据库操作模块
const db = require('../db/index')
const path = require('path')

// 获取文章列表数据
exports.getArticle = (req, res) => {
    console.log(req.body)
    const sql = `select * from ev_articles  where is_delete=0 `

    db.query(sql, req.body.status, (err, results) => {
        // 1.执行sql语句失败
        if (err) return res.cc(err)
        console.log(results)
        // 2.执行sql语句成功
        res.send({
            status: 0,
            message: '获取文章分类列表成功',
            data: results,
        })
    })
}

// 发布新文章
exports.addArticle = (req, res) => {
    // console.log(req.body) // 文本类型的数据
    // console.log('--------分割线----------')
    // console.log(req.file) // 文件类型的数据

    // res.send('ok')

    // 手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')

    // TODO：表单数据合法，继续后面的处理流程...

    // 处理文章的信息对象  自己需要组装传递给接口的数据形式
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.user.id,
    }
    const sql = 'insert into ev_articles set?'
    // 执行 SQL 语句
    db.query(sql, articleInfo, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('发布新文章失败！')

        // 发布文章成功
        res.cc('发布文章成功!', 0)
    })

}

// 根据id删除文章
exports.deleteArticle = (req, res) => {
    // 定义删除文章分类的SQL语句
    const sql = 'update  ev_articles set is_delete=1 where id=?'
    // 调用db.query()执行删除文章分类的SQL语句
    db.query(sql, req.params.id, (err, results) => {
        // 执行SQL语句失败r
        if (err) return res.cc(err)
        // SQL语句执行成功，但是影响行数不等于1
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败')
        // 删除文章分类成功
        res.cc('删除文章分类成功', 0)
    })
}