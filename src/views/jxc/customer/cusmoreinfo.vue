<template>
  <div id="moreinfo">
    <div class="itembox">
      <div class="title">
        <div class="dimg">
          <img v-if="data.logo!=undefined" :src="data.logo | imgUrl" alt />
        </div>
        <i class="i" style="top: 50px;right: 25px;">{{ errors.first('fullName') }}</i>
        <nut-textinput
          v-validate="'required'"
          name="fullName"
          v-if="isEdit"
          v-model="data.fullName"
          :clearBtn="false"
          style="padding-left: 0.2rem;height:1rem;"
          placeholder="请输入内容"
        />
        <p v-else>{{ data.fullName }}</p>
      </div>
      <div class="item borBom">
        <span class="n">联系人</span>
        <i class="i">{{ errors.first('displayName') }}</i>
        <nut-textinput
          v-validate="'required'"
          name="displayName"
          v-if="isEdit"
          class="v"
          placeholder="请输入内容"
          v-model="data.displayName"
          :clearBtn="false"
        />
        <div v-else class="v">{{ data.displayName }}</div>
      </div>
      <div class="item borBom">
        <span class="n">客户电话</span>
        <div class="v">
          {{ data.phone }}
          <i style="color: #3482EE" class="iconfont icondianhua"></i>
        </div>
      </div>
      <div class="item borBom">
        <span class="n">客户地址</span>
        <i class="i">{{ errors.first('address') }}</i>
        <nut-textinput
          v-validate="'required'"
          name="address"
          v-if="isEdit"
          class="v"
          placeholder="请输入内容"
          v-model="data.address"
          :clearBtn="false"
        />
        <div class="v textover" v-else>{{ data.address }}</div>
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
        <nut-textinput
          type="text"
          class="v"
          v-model="data.contact"
          @click="isVisible1 = true"
          v-if="isEdit"
          :clearBtn="false"
        />
        <div class="v textover" v-else>{{data.contactType==1?'公司':'个人'}}</div>
      </div>
      <div class="item borBom">
        <span class="n">客户传真</span>
        <nut-textinput
          v-if="isEdit"
          class="v"
          placeholder="请输入内容"
          v-model="data.fax"
          :clearBtn="false"
        />
        <div class="v textover" v-else>{{ data.fax }}</div>
      </div>
      <div class="item borBom">
        <span class="n">QQ</span>
        <nut-textinput
          v-if="isEdit"
          class="v"
          placeholder="请输入内容"
          v-model="data.qq"
          :clearBtn="false"
        />
        <div class="v textover" v-else>{{ data.qq }}</div>
      </div>
    </div>

    <div v-if="isEdit" class="btnbox">
      <div class="left">
        <nut-button block shape="circle" type="gray" color="#2789ED" @click="noEdit">取消</nut-button>
      </div>
      <div class="left">
        <nut-button block shape="circle" @click="EditCustomer">确认修改</nut-button>
      </div>
    </div>

    <div v-else class="else">
      <div class="main">
        <div class="left l1">
          <p>初期欠款</p>
          <span>{{data.initialArrears}}</span>
        </div>
        <div class="left l2">
          <p>累计销售</p>
          <span>{{data.totalMoney?data.totalMoney:0}}</span>
        </div>
        <div class="left l3">
          <p>订单应收</p>
          <span>{{data.receivableAmount?data.receivableAmount:0}}</span>
        </div>
      </div>
      <div class="itembox">
        <div class="item borBom" @click="goTo('historylist',id)">
          <span class="n">历史订单</span>
          <div class="v">
            <i class="iconfont iconyou"></i>
          </div>
        </div>
        <div class="item borBom" @click="goTo('saletotal',id)">
          <span class="n">销售统计</span>
          <div class="v">
            <i class="iconfont iconyou"></i>
          </div>
        </div>
      </div>
      <div class="btnbox">
        <div class="left">
          <nut-button block shape="circle" type="gray" color="#2789ED" @click="isShow">修改删除</nut-button>
        </div>
        <div class="left">
          <nut-button block shape="circle">发送对账单</nut-button>
        </div>
        <div class="left">
          <nut-button block shape="circle" @click="goTo('salemoney',id)">收款</nut-button>
        </div>
      </div>
    </div>

    <!-- 弹框 -->
    <nut-actionsheet
      :is-visible="isVisible"
      @close="isVisible = false"
      @choose="chooseCategory"
      cancelTxt="取消"
      :menu-items="menuItems"
      chooseTagValue="删除"
    ></nut-actionsheet>
  </div>
</template>

<script>
// import memo from '../../../components/memo'
const validate = {
  custom: {
    fullName: {
      required: () => '客户名称不得为空'
    },
    displayName: {
      required: () => '联系人不得为空'
    },
    address: {
      required: () => '地址不得为空'
    }
  }
}
export default {
  name: 'cusmoreinfo',
  data() {
    return {
      list1: [
        {
          id: 2,
          text: '个人'
        },
        {
          id: 1,
          text: '公司'
        }
      ],
      isVisible1: false,
      isEdit: false,
      id: this.$route.params.id,
      data: {},
      isVisible: false,
      menuItems: [
        {
          name: '修改',
          value: 0
        },
        {
          name: '删除',
          value: 1
        }
      ]
    }
  },
  created() {
    this.getCusById()
  },
  mounted() {
    this.$validator.localize('zh_CN', validate)
  },
  methods: {
    // 获取数据
    async getCusById() {
      const res = await this.$axios.get(
        'http://192.168.0.199:7077/customerCompany/showCustomerContace',
        {
          params: {
            companyId: this.id
          }
        }
      )
      if (res.data && res.data.data) {
        console.log(res.data.data)
        this.data = res.data.data
        let type = this.data.contactType == 1 ? '公司' : '个人'
        this.$set(this.data, 'contact', type)
      }
    },
    // 选择修改或删除
    isShow() {
      this.isVisible = true
    },
    chooseCategory(data) {
      this.isVisible = false
      console.log(data)
      if (data.value == 0) {
        if (!this.GLOBAL.role.erp_customer_mod) return this.$toast.fail('没有修改权限')
        this.isEdit = true
      } else if (data.value == 1) {
        if (!this.GLOBAL.role.erp_customer_del) return this.$toast.fail('没有删除权限')
        this.delCusById()
        //删除data.id的客户。跳转回客户列表
      }
    },
    //取消修改
    noEdit() {
      this.isEdit = false
      this.getCusById()
    },
    //修改资料
    EditCustomer() {
      this.$validator.validate().then(async valid => {
        if (true === valid) {
          console.log('验证通过')
          let data = {
            id: this.data.id,
            contactType: this.data.contactType,
            fullName: this.data.fullName,
            address: this.data.address,
            tenantId: this.GLOBAL.token.tenantId,
            fax: this.data.fax,
          }
          const res = await this.$axios.post('http://192.168.0.199:7077/customerCompany/modifyCustomerCompanyW', data
          )
          console.log(res)
          if (res.data && res.data.data) {
            this.EditPeople();
          } else {
            this.$toast.fail('修改信息失败')
          }
        } else {
          console.log(this.$validator.errors.all())
        }
      })
    },
    async EditPeople() {
      let data = {
        id: this.data.id,
        displayName: this.data.displayName,
        qq: this.data.qq,
        creatorId: this.GLOBAL.token.id,
        tenantId: this.GLOBAL.token.tenantId,
        contactType: this.data.contactType,
      }
      const res = await this.$axios.post('http://192.168.0.199:7077/customerCompany/modifyCustomerContactW', data
      )
      if (res.data && res.data.data) {
        this.$toast.success('修改成功！')
        this.getCusById()
        this.isEdit = false
      } else {
        this.$toast.fail('修改信息失败')
      }
    },
    // 删除客户
    async delCusById() {
      const res = await this.$axios.post('http://192.168.0.199:7077/customerCompany/updateCustomerByIds', [this.data.id])
      console.log(res)
      if (res.data.code === 200) {
        this.$toast.success('删除成功')
        this.$router.push({ name: 'customer' })
      } else {
        this.$toast.fail(res.data.msg)
      }
    },
    // 选择公司和个人
    chooseMenu(item, index) {
      this.isVisible1 = false
      this.list1.map(value => (value.selected = false))
      this.$set(this.list1[index], 'selected', true)
      this.data.contact = item.text
      this.data.contactType = item.id
    },
    //跳历史,统计
    goTo(name, id) {
      this.$router.push({
        name: name,
        params: { id: id }
      })
    }
  }
}
</script>

<style scoped lang="scss">
#moreinfo {
  padding: 0.3rem 0.3rem 0.8rem;
  >>> .nut-menu {
    .nut-menu-panel {
      display: block;
      width: 70%;
      position: absolute;
      left: 1.5rem;
      top: 1rem;
      color: #333;
      height: 1.8rem;
      border-radius: 0.1rem;
    }

    .selected {
      span {
        display: none;
      }
    }
  }
  .title {
    padding-bottom: 0.3rem;
    overflow: hidden;
    border-bottom: 1px solid #e5e5e5;
    .dimg {
      float: left;
      width: 1rem;
      height: 1rem;
      border-radius: 100%;
      background-color: #e5e5e5;
      img {
        width: 100%;
      }
    }
    p {
      line-height: 1rem;
      font-size: 0.36rem;
      padding-left: 1.2rem;
      color: #333333;
      font-weight: 500;
    }
  }
  .memo {
    padding: 0.3rem;
    border-radius: 0.3rem;
    background: linear-gradient(
      90deg,
      rgba(52, 130, 238, 1) 0%,
      rgba(93, 159, 243, 1) 100%
    );
    box-shadow: 0 8px 20px 0 rgba(52, 131, 238, 0.5);
    p {
      color: #ffffff;
      font-size: 0.28rem;
      line-height: 0.4rem;
      i {
        float: right;
        font-size: 14px;
      }
    }
    p.tt {
      font-size: 0.24rem;
      line-height: 0.3rem;
      margin-top: 0.1rem;
      opacity: 0.6;
    }
  }
  .i {
    font-size: 10px;
    color: red;
    position: absolute;
    right: 35px;
    z-index: 9;
  }
  .itembox {
    margin-top: 0.3rem;
    .item {
      height: 1rem;
      position: relative;
      line-height: 1rem;

      >>> .nut-textinput input {
        margin: 0.1rem 0.5rem 0 -0.1rem;
      }
      .n {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 0.2rem;
        color: #999999;
        font-size: 0.28rem;
      }
      .v {
        padding-left: 1.6rem;
        color: #333333;
        i {
          float: right;
        }
      }
    }
  }
  .main {
    height: 1.6rem;
    margin-top: 0.3rem;
    .left {
      width: 32%;
      margin-right: 2%;
      float: left;
      height: 100%;
      border-radius: 0.3rem;
      text-align: center;
      p {
        color: #ffffff;
        opacity: 0.6;
        font-size: 0.24rem;
        margin-top: 0.5rem;
      }
      span {
        color: #ffffff;
        font-size: 0.32rem;
        line-height: 0.6rem;
      }
    }
    .left:last-child {
      margin-right: 0;
    }
    .left.l1 {
      background: linear-gradient(
        0deg,
        rgba(255, 216, 95, 1) 0%,
        rgba(255, 172, 51, 1) 100%
      );
      box-shadow: 0px 8px 20px 0px rgba(251, 176, 31, 0.5);
    }
    .left.l2 {
      background: linear-gradient(
        0deg,
        rgba(151, 132, 253, 1) 0%,
        rgba(115, 68, 234, 1) 100%
      );
      box-shadow: 0px 4px 10px 0px rgba(124, 81, 238, 0.5);
      border-radius: 15px;
    }
    .left.l3 {
      background: linear-gradient(
        0deg,
        rgba(52, 130, 238, 1) 0%,
        rgba(93, 159, 243, 1) 100%
      );
      box-shadow: 0px 8px 20px 0px rgba(52, 130, 238, 0.5);
    }
  }
  .btnbox {
    padding: 0.5rem 0 0.6rem;
    display: flex;
    .left {
      flex: 1;
      margin-right: 4%;
      .nut-button {
        padding: 0;
        font-size: 0.32rem;
      }
    }
    .left:last-child {
      margin-right: 0;
    }
  }
}
</style>
