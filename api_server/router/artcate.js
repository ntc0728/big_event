// 文章分类的路由模块
// 导入express
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入文章分类的路由处理函数模块
// const artcate_handler = require('../router_handler/artcate')

const { getArticleCates, addArticleCates, deleteCateById, getArtCateById, updateCateById } = require('../router_handler/artcate')
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
// const { get_cate_schema, delete_cate_schema } = require('../schema/artcate')
// 导入根据Id获取分类的验证规则对象
// const { get_cate_schema } = require('../schema/artcate')
// 导入更新文章分类的验证规则对象
// const { update_cate_schema } = require('../schema/artcate')
const { get_cate_schema, add_cate_schema, delete_cate_schema, update_cate_schema } = require('../schema/artcate')

// 获取文章分类的列表数据
router.get('/cates', getArticleCates)
// 新增文章分类的路由
router.post('/addcates', expressJoi(add_cate_schema), addArticleCates)
// 根据id删除文章分类的路由
router.get('/deletecate/:id', expressJoi(delete_cate_schema), deleteCateById)
// 根据id获取文章分类的路由
router.get('/cates/:id', expressJoi(get_cate_schema), getArtCateById)
// 根据id更新文章分类的路由
router.post('/updatecate', expressJoi(update_cate_schema), updateCateById)



// 向外共享路由对象
module.exports = router