/**
 * 用户注册
 *  1. 收集表单数据并判断
 *  2. 数据提交
 *  3. 用户提示
 * */
document.querySelector('#btn-register').addEventListener('click', async () => {
  const form = document.querySelector('.register-form')
  const data = serialize(form, { hash: true, empty: true })
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
      url: '/register',
      method: 'post',
      data
    })
    showToast(res.message)
  } catch (error) {
    // console.dir(error)
    showToast(error.response.data.message)
  }

})