
// 统一的弹窗方法
function showToast(msg) {
  const toastDom = document.querySelector('.my-toast')
  // 实例化toast组件
  const toast = new bootstrap.Toast(toastDom)
  // 修改内容并显示
  document.querySelector('.toast-body').innerText = msg
  toast.show()
}

// 每个页面都会导入该js 统一的设置写这里即可

// axios基地址
axios.defaults.baseURL = 'https://hmajax.itheima.net/'

// axios拦截器
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // console.log(config)
  const token = window.localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  // 剥离一层数据，外部少点一次data
  return response.data;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  console.dir(error)
  if (error.response && error.response.status === 401) {
    // 登录状态失效，删除token，重新登录
    showToast('请重新登录')
    localStorage.removeItem('token')
    setTimeout(() => {
      window.location.href = './login.html'
    }, 1000);
  }
  // 对响应错误做点什么
  return Promise.reject(error);
});


// 本地判断token是否存在的函数
function checkLogin() {
  const token = window.localStorage.getItem('token')
  if (!token) {
    showToast('请先登录')
    setTimeout(() => {
      window.location.href = './login.html'
    }, 1000)
  }
}

// 渲染用户头像的函数
function renderUsername() {
  const userDom = document.querySelector('.username')
  userDom.innerText = localStorage.getItem('username')
}


// 退出逻辑
function logout() {
  document.querySelector('#logout').addEventListener('click', () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    window.location.href = './login.html'
  })
}
