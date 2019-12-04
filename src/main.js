import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios'
import './validate'

import './assets/js/common'
import './assets/font/iconfont.css'
import utils from './assets/js/until'

import global_ from './components/Global' //引用文件

import {
  Button,
  SearchBar,
  Toast,
  ActionSheet,
  ButtonGroup,
  Dialog,
  Switch,
  Stepper,
  DatePicker,
  Menu,
  TextInput
} from '@nutui/nutui'
import '@nutui/nutui/dist/nutui.scss'
Button.install(Vue)
SearchBar.install(Vue)
ActionSheet.install(Vue)
ButtonGroup.install(Vue)
Dialog.install(Vue)
Switch.install(Vue)
Stepper.install(Vue)
DatePicker.install(Vue)
Menu.install(Vue)
TextInput.install(Vue)

Vue.prototype.GLOBAL = global_ //挂载到Vue实例上面
Vue.prototype.$toast = Toast
Vue.prototype.$utils = utils
/*
 *  不能删除此注释
 *  按需引入后如果出现scss混合报错，@mixin @include
 *  查看相应的报错文件中是否引入\node_modules\@nutui\nutui\dist\styles\mixins文件中相应的内容
 * */

Vue.prototype.$axios = axios

Vue.filter('imgUrl', function(data) {
  return 'https://uwood.oss-cn-qingdao.aliyuncs.com/shop/' + data
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
