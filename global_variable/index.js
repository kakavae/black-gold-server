/* 用于静态资源加载地址，在哪个服务器就写那个服务器的源 */
/* 图片的请求地址举例： */
/* http://127.0.0.1:8090/api/images/7899a725-8bb1-4944-b910-34593bc73d82.jpg */
/* 图片的访问地址 */
const SERVER_NAME = 'http://127.0.0.1:8090'

/* 图片也要访问远程服务器 */
// const SERVER_NAME = 'http://101.42.32.142:80/blog'

module.exports = {
  SERVER_NAME
}