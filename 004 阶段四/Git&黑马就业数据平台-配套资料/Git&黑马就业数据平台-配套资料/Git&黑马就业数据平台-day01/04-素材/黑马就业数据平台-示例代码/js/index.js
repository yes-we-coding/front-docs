/**
 * 登录判断
 *  1. token非空判断
 * */
checkLogin()
renderUsername()
logout()
/**
 * 统计数据获取
 *  1. 函数抽取
 *  2. 调用抽取的函数，请求头中携带Token
 * */
async function getDashBoard() {
  const { data } = await axios({
    url: '/dashboard',
  })

  renderOverview(data.overview)
  initYearChart(data.year)
  initSalaryChart(data.salaryData)
  initGroupChart(data.groupData)
  initSalaryPieChart(data.salaryData)
  initMapChart(data.provinceData)
}


// 渲染顶部的数据
function renderOverview(overview) {
  Object.keys(overview).forEach(key => {
    document.querySelector(`.${key}`).innerText = overview[key]
  })
}


// 全年薪资走势
const initYearChart = async (data) => {
  const myEchart = echarts.init(document.querySelector('#line'))
  myEchart.setOption({
    xAxis: {
      type: 'category',
      // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      data: data.map((item) => item.month),
      axisLine: {
        lineStyle: {
          color: '#ccc',
          type: 'dashed',
        },
      },
      axisLabel: {
        color: '#999',
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    title: {
      text: '2022全学科薪资走势',
      top: 15,
      left: 10,
      textStyle: {
        fontSize: 16,
      },
    },
    grid: {
      top: '20%',
    },
    // linear-gradient(135deg, #6f42c1 0%, #4582EC 100%)
    color: [
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
          {
            offset: 0,
            color: '#499FEE', // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#5D75F0', // 100% 处的颜色
          },
        ],
      },
    ],
    series: [
      {
        // data: [9000, 12000, 15000, 13000, 10000, 18000, 14000, 10000, 12000, 13000, 15000, 19000],
        data: data.map((item) => item.salary),
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 6,
        },
        symbolSize: 10,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#499FEE',
            },
            {
              offset: 0.8,
              color: 'rgba(255,255,255,0.2)',
            },
            {
              offset: 1,
              color: 'rgba(255,255,255,0)',
            },
          ]),
        },
      },
    ],
  })
}

// 班级薪资分布
const initSalaryChart = (data) => {
  const myEchart = echarts.init(document.querySelector('#salary'))
  myEchart.setOption({
    title: {
      text: '班级薪资分布',
      top: 15,
      left: 10,
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      bottom: '6%',
      left: 'center',
    },
    color: ['#FDA224', '#5097FF', '#3ABCFA', '#34D39A'],
    series: [
      {
        name: '班级薪资分布',
        type: 'pie',
        radius: ['50%', '64%'],
        center: ['50%', '45%'],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        labelLine: {
          show: false,
        },
        // data: [
        //   { value: 1048, name: '1万以下' },
        //   { value: 235, name: '1万-1.5万' },
        //   { value: 735, name: '1.5万-2万' },
        //   { value: 580, name: '2万以上' },
        // ],
        data: data.map((item) => {
          return {
            value: item.g_count + item.b_count,
            name: item.label,
          }
        }),
      },
    ],
  })
}

// 籍贯分布
const initMapChart = (data) => {
  const myEchart = echarts.init(document.querySelector('#map'))
  const dataList = [
    { name: '南海诸岛', value: 0 },
    { name: '北京', value: 0 },
    { name: '天津', value: 0 },
    { name: '上海', value: 0 },
    { name: '重庆', value: 0 },
    { name: '河北', value: 0 },
    { name: '河南', value: 0 },
    { name: '云南', value: 0 },
    { name: '辽宁', value: 0 },
    { name: '黑龙江', value: 0 },
    { name: '湖南', value: 0 },
    { name: '安徽', value: 0 },
    { name: '山东', value: 0 },
    { name: '新疆', value: 0 },
    { name: '江苏', value: 0 },
    { name: '浙江', value: 0 },
    { name: '江西', value: 0 },
    { name: '湖北', value: 0 },
    { name: '广西', value: 0 },
    { name: '甘肃', value: 0 },
    { name: '山西', value: 0 },
    { name: '内蒙古', value: 0 },
    { name: '陕西', value: 0 },
    { name: '吉林', value: 0 },
    { name: '福建', value: 0 },
    { name: '贵州', value: 0 },
    { name: '广东', value: 0 },
    { name: '青海', value: 0 },
    { name: '西藏', value: 0 },
    { name: '四川', value: 0 },
    { name: '宁夏', value: 0 },
    { name: '海南', value: 0 },
    { name: '台湾', value: 0 },
    { name: '香港', value: 0 },
    { name: '澳门', value: 0 },
  ]
  dataList.forEach((item) => {
    const obj = data.find((it) => it.name.replace(/省|回族自治区|吾尔自治区|壮族自治区|特别行政区|自治区/g, '') === item.name)
    if (obj) item.value = obj.value
  })
  let option = {
    title: {
      text: '籍贯分布',
      top: 10,
      left: 10,
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 位学员',
      borderColor: 'transparent',
      backgroundColor: 'rgba(0,0,0,0.5)',
      textStyle: {
        color: '#fff',
      },
    },
    visualMap: {
      min: 0,
      max: 6,
      left: 'left',
      bottom: '20',
      text: ['6', '0'],
      inRange: {
        color: ['#ffffff', '#0075F0'],
      },
      show: true,
      left: 40,
    },
    geo: {
      map: 'china',
      roam: false,
      zoom: 1.0,
      label: {
        normal: {
          show: true,
          fontSize: '10',
          color: 'rgba(0,0,0,0.7)',
        },
      },
      itemStyle: {
        normal: {
          borderColor: 'rgba(0, 0, 0, 0.2)',
          color: '#e0ffff',
        },
        emphasis: {
          areaColor: '#34D39A',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 20,
          borderWidth: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
    series: [
      {
        name: '籍贯分布',
        type: 'map',
        geoIndex: 0,
        data: dataList,
      },
    ],
  }
  myEchart.setOption(option)
}

// 男女薪资分布
const initSalaryPieChart = (data) => {
  const myEchart = echarts.init(document.querySelector('#gender'))
  myEchart.setOption({
    title: [
      {
        text: '男女薪资分布',
        left: 10,
        top: 10,
        textStyle: {
          fontSize: 16,
        },
      },
      {
        text: '男生',
        left: '50%',
        top: '45%',
        textAlign: 'center',
        textStyle: {
          fontSize: 12,
        },
      },
      {
        text: '女生',
        left: '50%',
        top: '85%',
        textAlign: 'center',
        textStyle: {
          fontSize: 12,
        },
      },
    ],
    color: ['#FDA224', '#5097FF', '#3ABCFA', '#34D39A'],
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: 50,
        radius: ['20%', '30%'],
        center: ['50%', '30%'],
        datasetIndex: 1,
        // data: [{name:'1万以下',value: 4},...]
        data: data.map((item) => ({ name: item.label, value: item.b_count })),
      },
      {
        type: 'pie',
        radius: 50,
        radius: ['20%', '30%'],
        center: ['50%', '70%'],
        datasetIndex: 2,
        // data: [{name:'1万以下',value: 4},...]
        data: data.map((item) => ({ name: item.label, value: item.g_count })),
      },
    ],
  })
}

// 每一组的薪资
const initGroupChart = (data) => {
  // 初始化图表
  const myEchart = echarts.init(document.querySelector('#lines'))
  const option = {
    grid: {
      left: 70,
      top: 30,
      right: 30,
      bottom: 50,
    },
    xAxis: {
      type: 'category',
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'ooi'],
      data: data[1].map((item) => item.name),
      axisLine: {
        lineStyle: {
          color: '#ccc',
          type: 'dashed',
        },
      },
      axisLabel: {
        color: '#999',
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    tooltip: {
      trigger: 'item',
    },
    color: [
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#34D39A', // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(52,211,154,0.2)', // 100% 处的颜色
          },
        ],
      },
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#499FEE', // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(73,159,238,0.2)', // 100% 处的颜色
          },
        ],
      },
    ],
    series: [
      {
        // data: [12200, 17932, 13901, 13934, 21290, 23300, 13300, 13320],
        data: data[1].map((item) => item.hope_salary),
        type: 'bar',
        name: '期望薪资',
      },
      {
        // data: [22820, 19932, 16901, 15934, 31290, 13300, 14300, 18320],
        data: data[1].map((item) => item.salary),
        type: 'bar',
        name: '就业薪资',
      },
    ],
  }
  myEchart.setOption(option)
  const btns = document.querySelector('#btns')
  btns.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      btns.querySelector('.btn-blue')?.classList.remove('btn-blue')
      e.target.classList.add('btn-blue')
      const group = e.target.innerText
      // 切换数据
      option.xAxis.data = data[group].map((item) => item.name)
      option.series[0].data = data[group].map((item) => item.hope_salary)
      option.series[1].data = data[group].map((item) => item.salary)
      myEchart.setOption(option)
    }
  })
}



// 获取数据
getDashBoard()

// 左侧0%颜色   #34D39A
// 左侧100%颜色 rgba(52,211,154,0.2)

// 右侧0%颜色   #499FEE
// 右侧100%颜色 rgba(73,159,238,0.2)
