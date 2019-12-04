import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //类目信息
    category: [
      { id: 2, value: '实木板材' },
      { id: 1, value: '原木' },
      { id: 5, value: '人造板' },
      { id: 4, value: '木配城' },
      { id: 3, value: '名贵才' }
    ],
    data: [],
    packageInfo: {},
    warestore: '',
    warestoreId: '',
    token: undefined,
    role: undefined
  },
  mutations: {
    setCategory(state, value) {
      console.log(value)
      state.data = value
    },
    setPackage(state, val) {
      state.packageInfo = val
    },
    // 登陆
    login(state, value) {
      state.token = value
      sessionStorage.setItem('youmuUser', value)
    },
    // 退出登陆
    loginout(state) {
      state.token = null
      sessionStorage.removeItem('youmuUser')
    },
    //保存权限
    saveRole(state, value) {
      let data = JSON.parse(value)
      let obj = {}
      for (let i in data.menuList) {
        obj[data.menuList[i].permission] = true
      }
      state.role = obj
      sessionStorage.setItem('role', JSON.stringify(obj))
    },
    //删除权限
    removeRole(state) {
      state.role = null
      sessionStorage.removeItem('role')
    }
  },
  actions: {}
})
