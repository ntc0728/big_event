// 导入定义验证规则的模块
const joi = require('@hapi/joi')
// 定义标题 分类Id 内容 发布状态 的验证规则
const title = joi.string().required()
// joi.number().integer().min(1).required()
const cate_id = joi.string().required()
// allow 表示该项允许为空
const content = joi.string().required().allow('')
// valid 有效的  可选项    invalid 无效的；无用的
const state = joi.string().valid('已发布', '草稿').required()

// 验证规则对象 - 发布文章
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state,
    }
}

// id的校验规则
const id = joi.number().integer().min(1).required()

// 验证规则对象 - 根据id删除文章
exports.delete_article_schema = {
    params: {
        id,
    },
}