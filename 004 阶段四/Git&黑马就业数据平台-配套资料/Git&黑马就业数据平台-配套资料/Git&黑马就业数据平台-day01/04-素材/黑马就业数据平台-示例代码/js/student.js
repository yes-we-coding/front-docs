checkLogin()
renderUsername()
logout()

// 1. 初始化渲染
const renderList = async () => {
  const res = await axios.get('/students')
  const html = res.data
    .map((item, i) => {
      return `
        <tr>
          <td>${item.name}</td>
          <td>${item.age}</td>
          <td>${item.gender === 0 ? '男' : '女'}</td>
          <td>第${item.group}组</td>
          <td>${item.hope_salary}</td>
          <td>${item.salary}</td>
          <td>${item.province} ${item.city} ${item.area}</td>
          <td data-id=${item.id}>
            <a href="javascript:;" class="text-success mr-3"><i  class="bi bi-pen"></i></a>
            <a href="javascript:;" class="text-danger"><i  class="bi bi-trash"></i></a>
          </td>
        </tr>
      `
    })
    .join('')
  document.querySelector('.list').innerHTML = html
  document.querySelector('.total').innerHTML = res.data.length
}
renderList()

// 初始化模态框 & 城市选择
const modalBox = document.querySelector('#modal')
const modal = new bootstrap.Modal(modalBox)
const ps = document.querySelector('[name=province]')
const cs = document.querySelector('[name=city]')
const as = document.querySelector('[name=area]')
const initCity = async () => {
  // 显示省市区
  const { list: province } = await axios.get('/api/province')
  const phtml = province.map((item) => `<option value="${item}">${item}</option>`).join('')
  ps.innerHTML = `<option value="">--省份--</option>${phtml}`
  // 省市区联动
  ps.addEventListener('change', async () => {
    cs.value = ''
    as.value = ''
    const { list: city } = await axios.get('/api/city', { params: { pname: ps.value } })
    const chtml = city.map((item) => `<option value="${item}">${item}</option>`).join('')
    cs.innerHTML = `<option value="">--市--</option>${chtml}`
    as.innerHTML = `<option value="">--区--</option>`
  })
  cs.addEventListener('change', async () => {
    as.value = ''
    const { list: area } = await axios.get('/api/area', { params: { pname: ps.value, cname: cs.value } })
    const ahtml = area.map((item) => `<option value="${item}">${item}</option>`).join('')
    as.innerHTML = `<option value="">--区--</option>${ahtml}`
  })
}
initCity()

// 2. 添加学生
document.querySelector('#openModal').addEventListener('click', () => {
  modalBox.querySelector('form').reset()
  cs.innerHTML = `<option value="">--市--</option>`
  as.innerHTML = `<option value="">--区--</option>`
  modalBox.querySelector('.modal-title').innerHTML = '添加学员'
  modalBox.dataset.id = 'add'
  modal.show()
})
const form = modalBox.querySelector('form')
document.querySelector('#submit').addEventListener('click', async () => {
  const data = serialize(form, { hash: true, empty: true })
  data.age = +data.age
  data.hope_salary = +data.hope_salary
  data.salary = +data.salary
  data.gender = +data.gender
  data.group = +data.group
  if (modalBox.dataset.id !== 'add') {
    try {
      await axios.put(`/students/${modalBox.dataset.id}`, data)
      modal.hide()
      renderList()
    } catch (error) {
      showToast('修改失败')
    }
  } else {
    try {
      await axios.post('/students', data)
      modal.hide()
      renderList()
    } catch (error) {
      showToast('添加失败')
    }
  }
})

// 3. 删除学生
document.querySelector('.list').addEventListener('click', async (e) => {
  const btn = e.target
  const { id } = btn.parentNode.parentNode.dataset
  if (btn.classList.contains('bi-trash')) {
    delStudent(id)
  }
  if (btn.classList.contains('bi-pen')) {
    editStudent(id)
  }
})

async function delStudent(id) {
  // 删除
  try {
    await axios.delete(`/students/${id}`)
    renderList()
  } catch (error) {
    showToast('删除失败')
  }
}

async function editStudent(id) {
  // 编辑
  const { data: student } = await axios.get(`/students/${id}`)
  const fields = document.querySelectorAll('form [name]')
  Array.from(fields).forEach(async (item) => {
    if (item.name === 'gender') {
      if (+item.value === student[item.name]) item.checked = true
    } else {
      item.value = student[item.name]
    }
  })
  const { list: city } = await axios.get('/api/city', { params: { pname: student.province } })
  const chtml = city.map((item) => `<option value="${item}">${item}</option>`).join('')
  cs.innerHTML = `<option value="">--市--</option>${chtml}`
  cs.value = student.city
  const { list: area } = await axios.get('/api/area', { params: { pname: ps.value, cname: cs.value } })
  const ahtml = area.map((item) => `<option value="${item}">${item}</option>`).join('')
  as.innerHTML = `<option value="">--区--</option>${ahtml}`
  as.value = student.area

  modalBox.querySelector('.modal-title').innerHTML = '修改学员'
  // 记录ID修改使用
  modalBox.dataset.id = student.id
  modal.show()
}