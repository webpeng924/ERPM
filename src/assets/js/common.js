import Vue from 'vue'

// 获取类目列表
Vue.prototype.$getCategory = (axios, callback) => {
  axios({
    method: 'get',
    url: ''
  }).then(
    res => {
      if (res) {
      } else {
      }
    },
    err => {
      console.log('获取类目')
      setTimeout(() => {
        callback([
          { id: 2, value: '实木板材' },
          { id: 1, value: '原木' },
          { id: 5, value: '人造板' },
          { id: 4, value: '木配城' },
          { id: 3, value: '名贵材' }
        ])
      }, 3000)
    }
  )
}

// Vue.prototype.$getCategory = (axios, callback) => {
//   axios({
//     method: 'get',
//     url: '/lll'
//   }).then(res => {
//     if (res) {
//       console.log(res)
//       console.log('获取类目')
//       setTimeout(() => {
//         callback([
//           { id: 0, value: '全部' },
//           { id: 1, value: '实木板材' },
//           { id: 2, value: '原木' },
//           { id: 3, value: '人造板' },
//           { id: 4, value: '木配城' },
//           { id: 5, value: '名贵才' }
//         ])
//       }, 3000)
//     } else {
// console.log(2)
//     }
//   })
// }
