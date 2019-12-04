<template>
  <div id="add">
    <div class="itembox">
      <div class="item borBom">
        <span class="n">客户名称</span>
        <input
          v-validate="'required'"
          name="fullName"
          type="text"
          class="v"
          placeholder="请填写客户名称（必填）"
          v-model="cusInfo.fullName"
        />
        <i>{{ errors.first('fullName') }}</i>
      </div>
      <div class="item borBom">
        <span class="n">联系人</span>
        <input
          v-validate="'required'"
          name="displayName"
          type="text"
          class="v"
          placeholder="请填写姓名（必填）"
          v-model="cusInfo.displayName"
        />
        <i>{{ errors.first('displayName') }}</i>
      </div>
      <div class="item borBom">
        <span class="n">联系电话</span>
        <input
          name="phone"
          type="text"
          class="v"
          placeholder="请填写电话（必填）"
          v-model="cusInfo.phone"
          v-validate="'required|phone'"
        />
        <i>{{ errors.first('phone') }}</i>
      </div>
      <div class="item borBom">
        <span class="n">公司归属</span>
        <nut-menu
          :list="list1"
          :isVisible="isVisible1"
          type="simple"
          @close="isVisible1 = false"
          @choose="chooseMenu"
        >></nut-menu>
        <input
          type="text"
          class="v"
          placeholder="请选择"
          v-model="cusInfo.contact"
          @click="isVisible1 = true"
        />
      </div>
      <div class="item borBom">
        <span class="n">联系地址</span>
        <input type="text" class="v" placeholder="省/市(区)/县" v-model="cusInfo.address" ref="title1" />
      </div>
      <div class="item borBom">
        <span class="n">客户传真</span>
        <input type="text" class="v" placeholder="请输入传真号" v-model="cusInfo.fax" />
      </div>
      <div class="item borBom">
        <span class="n">QQ</span>
        <input type="text" class="v" placeholder="请输入QQ" v-model="cusInfo.qq" />
      </div>
      <div class="item borBom">
        <span class="n">备注</span>
        <input type="text" class="v textover" placeholder="请输入备注内容" v-model="cusInfo.memo" />
      </div>
    </div>
    <div class="btn">
      <nut-button block shape="circle" @click="addCus">确认新建</nut-button>
    </div>
  </div>
</template>

<script>
const validate = {
  custom: {
    fullName: {
      required: () => '客户名称不得为空'
    },
    displayName: {
      required: () => '联系人不得为空'
    },
    phone: {
      required: () => '请输入手机号码'
    }
  }
}
export default {
  data() {
    return {
      cusInfo: {
        fullName: '',
        displayName: '',
        phone: '',
        contact: '',
        contactType: '',
        address: '',
        fax: '',
        qq: '',
        memo: ''
      },
      list1: [
        {
          id: 2,
          text: '个人',
          selected: true
        },
        {
          id: 1,
          text: '公司',
          selected: false
        }
      ],
      isVisible1: false
    }
  },
  mounted() {
    this.$validator.localize('zh_CN', validate)
    this.$validator.extend('phone', {
      getMessage: '请输入正确的手机号',
      validate: value => {
        return /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
      }
    })
  },
  methods: {
    addCus() {
      this.$validator.validate().then(async valid => {
        if (true === valid) {
          console.log('验证通过')
          let data = {
            customerCompany: {
              address: this.cusInfo.address,
              creatorId: this.GLOBAL.token.id,
              fullName: this.cusInfo.fullName,
              phone: this.cusInfo.phone,
              tenantId: this.GLOBAL.token.tenantId,
              fax: this.cusInfo.fax,
              memo: this.cusInfo.memo
            },
            customerContact: {
              contactType: this.cusInfo.contactType,
              creatorId: this.GLOBAL.token.id,
              belongId: this.GLOBAL.token.id,
              displayName: this.cusInfo.displayName,
              phone: this.cusInfo.phone,
              tenantId: this.GLOBAL.token.tenantId,
              qq: this.cusInfo.qq,
              memo: this.cusInfo.memo
            }
          }
          const res = await this.$axios.post(
            'http://192.168.0.199:7077/customerCompany/addCustomerCompanyDtoW',
            data
          )
          console.log(res)
          this.$toast.text('新建成功')
          this.$router.back(-1)
        } else {
          console.log(this.$validator.errors.all())
        }
      })
    },
    chooseMenu(item, index) {
      this.isVisible1 = false
      this.list1.map(value => (value.selected = false))
      this.$set(this.list1[index], 'selected', true)
      this.cusInfo.contact = item.text
      this.cusInfo.contactType = item.id
    },
    switchMenu(param, num) {
      this.num = num
      this.titlenum = param.split('isVisible')[1]
      for (let key in this.visible) {
        if (key !== param) {
          this.visible[key] = false
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
#add {
  height: 100%;
  position: relative;
  .itembox {
    // margin-top: 0.3rem;
    >>> .nut-menu {
      .nut-menu-panel {
        display: block;
        width: 60%;
        position: absolute;
        left: 1.6rem;
        top: 1rem;
        color: #333;
        height: 1.8rem;
      }

      .selected {
        span {
          display: none;
        }
      }
    }
    .item {
      height: 1rem;
      position: relative;
      line-height: 1rem;
      input::-webkit-input-placeholder {
        color: #ccc;
      }
      input::-moz-input-placeholder {
        color: #ccc;
      }
      input::-ms-input-placeholder {
        color: #ccc;
      }
      .n {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 0.3rem;
        color: #999999;
        font-size: 0.28rem;
      }
      .v {
        padding-left: 1.8rem;
        color: #333333;
      }
      i {
        float: right;
        color: #ed273a;
        padding: 0 0.24rem;
        font-size: 0.24rem;
      }
    }
  }
  .btn {
    position: absolute;
    bottom: 0.8rem;
    padding-left: 0.76rem;
    width: 80%;
  }
}
</style>
