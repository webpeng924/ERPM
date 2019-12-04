import Vue from 'vue'

import VeeValidate, { Validator } from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN'
Vue.use(VeeValidate, {
  dictionary: {
    zh_CN: zh_CN
  }
})
Validator.localize('zh_CN')
