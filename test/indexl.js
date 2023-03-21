function b(data, goodname) {
  function a(data) {
    console.log(data)
    console.log(goodname)
  }
  a(data)
}

b({ name: 'zs' }, 'ls')

// 注意变量的作用域
