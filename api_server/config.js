// 这是一个全局的配置文件
// 向外共享 加密 和 还原 token 的jwtSecretKey 字符串

module.exports = {
    // 加密和解密 Token 的密钥
    jwtSecretKey: 'itheima',
    // token的有效期
    expiresIn: '10h',
}