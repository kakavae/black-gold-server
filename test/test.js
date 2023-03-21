new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1000)
}).then((msg) => {
  console.log(msg)
})
