// 导入数据库操作模块
const db = require('../db/index')

// 获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
    // 根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete为0表示没有被标记为删除的数据
    const sql = 'select * from  my_db_01.ev_article_cate where is_delete=0 order by Id asc'
    // 被调用db.query() 执行sql语句
    db.query(sql, (err, results) => {
        // 1.执行sql语句失败
        if (err) return res.cc(err)

        // 2.执行sql语句成功
        res.send({
            status: 0,
            message: '获取文章分类列表成功',
            data: results,
        })
    })
}

// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
    // 定义查重的sql语句
    // 定义查询 分类名称与分类别名是否被占用的sql语句
    const sql = 'select * from  my_db_01.ev_article_cate where name=? or alias=?'

    // 2.调用db.query()执行查重的操作
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        // 判断执行sql语句是否失败
        if (err) return res.cc(err)

        // 判断数据的 length
        // 分类名称 和 分类别名都被占用
        if (results.length === 2) return res.cc('分类名称和分类别名被占用，请更换后重试!')
        // length等于1的3种情况
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias)
            return res.cc('分类名称与分类别名被占用，请更换后重试!')
        if (results.length === 1 && results[0].name === req.body.name)
            return res.cc('分类名称被占用，请更换')
        if (results.length === 1 && results[0].alias === req.body.alias)
            return res.cc('分类别名被占用，请更换')

        // db.query(sql, [name, alias], (err, results) => {
        //     if (err) return res.cc(err)
        //     if (results.length === 2) return res.cc('分类名称和分类别名被占用，请更换后重试!')
        //     if (results.length === 1) {
        //         const { name: cName, alias: cAlias } = results[0]
        //         if (cName === name && cAlias === alias) {
        //             return res.cc('分类名称和别名被占用，请更换后重试!')
        //         } else if (cName === name) {
        //             return res.cc('分类名称被占用，请更换')
        //         } else if (Alias === alias) {
        //             return res.cc('分类别名被占用，请更换')
        //         }
        //     }
        // })

        // 定义新增文章分类的SQL语句
        const sql = 'insert into ev_article_cate set ?'
        // 调用db.query()执行新增文章分类的SQL语句

        db.query(sql, req.body, (err, results) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败!')
            // 新增文章分类成功
            res.cc('新增文章分类成功!', 0)
        })

    })
}

// 删除文章分类的处理函数 (标记删除/软删除/逻辑删除)
exports.deleteCateById = (req, res) => {
    // 定义删除文章分类的SQL语句
    const sql = 'update  my_db_01.ev_article_cate set is_delete=1 where id=?'
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

// 根据Id获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
    // // 定义根据id获取文章分类的SQL语句
    const sql = 'select * from  my_db_01.ev_article_cate where id=?'
    // 调用da.query() 执行sql语句
    db.query(sql, req.params.id, (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)

        // sql 语句执行成功，但是没有查询到任何数据
        if (results.length !== 1) return res.cc('获取文章分类数据失败!')
        // 把数据响应给客户端
        res.send({
            status: 0,
            message: '获取文章分类数据成功',
            data: results[0]
        })
    })
}

// 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 sql 语句 //不等于
    const sql = 'select * from  my_db_01.ev_article_cate where Id<>? and (name=? or alias=?)'
    // 调用db.query()执行查重的操作
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)

        //分类名称 和 分类别名 都被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // TODO：更新文章分类

        // 定义更新文章分类的sql语句
        const sql = 'update  my_db_01.ev_article_cate set? where Id=?'
        // 调用db.query() 执行SQL语句
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            // 执行sql语句失败
            if (err) return res.cc(err)

            // sql语句执行成功，但是影响行数不等于1
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败!')

            // 更新文章分类成功
            res.cc('更新文章分类成功123', 0)
        })
    })
}

