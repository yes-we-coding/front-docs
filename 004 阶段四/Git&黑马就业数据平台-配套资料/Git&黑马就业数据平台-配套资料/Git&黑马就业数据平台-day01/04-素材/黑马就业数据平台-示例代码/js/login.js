/**
 * 用户登录
 *  1. 收集表单数据并判断
 *  2. 数据提交
 *  3. 提示用户
 *  4. 登录成功（缓存数据+页面跳转）
 * */
document.querySelector('#btn-login').addEventListener('click', async () => {
  const form = document.querySelector('.login-form')
  const data = serialize(form, { empty: true, hash: true })
  if (data.username === '' || data.password === '') {
    showToast('用户名或密码不能为空')
    return
  }
  if (data.username.length < 8 || data.password.length < 6) {
    showToast('用户名长度大于等于8，密码长度大于等于6')
    return
  }
  try {
    const res = await axios({
      url: '/login',
      method: 'post',
      data
    })
    // 移除成功时多余的.data
    showToast(res.message)
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('username', res.data.username)
    setTimeout(() => {
      window.location.href = './index.html'
    }, 1000)
  } catch (error) {
    showToast(error.response.data.message)
  }

})

