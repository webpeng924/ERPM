<template>
  <div id="col2">
    <div class="item borBom">
      <span class="n">付款金额</span>
      <div class="v">
        <span>{{totalMoney}}</span>
      </div>
    </div>
    <div class="item">
      <span class="n">付款账号</span>
      <div class="v" @click="visible.account=true">
        {{account.name?account.name:'选择账户'}}
        <i class="iconfont iconyou"></i>
      </div>
    </div>
    <div class="item2" style="background-color: #f5f5f5;height:0.8rem;line-height:0.8rem">
      <span class="n2">
        <i
          v-if="checked"
          class="iconfont iconxuanzekuangxuanzhong"
          style=" vertical-align: middle; color:#3986EF"
        ></i>
        <i
          v-else
          class="iconfont iconxuanzekuangmoren"
          style=" vertical-align: middle;color:#3986EF"
        ></i>
        销售单号
      </span>
      <div class="v2">待付金额</div>
      <div class="v3">
        <span>本次付款</span>
        <span style="font-size:0.2rem;color:rgba(153,153,153,1);">优惠金额</span>
      </div>
    </div>
    <div class="item2 borBom" v-for="v in list" :key="v.id">
      <span class="n2" @click="select(v)">
        <i
          v-if="selected.id == v.id"
          class="iconfont iconxuanzekuangxuanzhong"
          style=" vertical-align: middle;color:#3986EF"
        ></i>
        <i
          v-else
          class="iconfont iconxuanzekuangmoren"
          style=" vertical-align: middle;color:#3986EF"
        ></i>
        {{v.orderNo}}
      </span>
      <div class="v2">{{v.receivableAmount}}</div>
      <div class="v3" @click="chooseMoney(v)">
        <span style="padding-top:0.1rem;color:#3986EF">{{v.val1}}</span>
        <span style="font-size:0.2rem;color:#FFAC33;">{{v.val2}}</span>
        <i class="iconfont iconyou" style="position: absolute;right:0"></i>
      </div>
    </div>

    <div class="btn">
      <nut-button block shape="circle" @click="getMoney">确认收款</nut-button>
    </div>
    <!-- 选择账户 -->
    <nut-actionsheet
      :is-visible="visible.account"
      :menu-items="accountList"
      optionTag="name"
      :chooseTagValue="account.name"
      @close="visible.account=false"
      @choose="chooseAccount"
    ></nut-actionsheet>
    <!-- 选择金额弹框 -->
    <nut-dialog
      title="付款金额"
      :visible="visible.pay"
      @ok-btn-click="payOk"
      @cancel-btn-click="visible.pay=false"
      @close="visible.pay=false"
    >
      <p>
        销售订单：
        <span style="color:#333333">{{choose.orderNo}}</span>
      </p>
      <p style="margin-bottom: 0.3rem;">
        待付金额：
        <span style="color:#3986EF">{{choose.receivableAmount}}</span>
      </p>
      <input type="number" v-model="payInfo.val1" placeholder="请输入本次付款金额" />
      <input type="number" v-model="payInfo.val2" placeholder="请输入优惠金额" />
    </nut-dialog>
  </div>
</template>

<script>
export default {
  name: "colmoney2",
  data() {
    return {
      visible: {
        account: false,
        pay: false
      },
      payInfo: {
        val1: 0,
        val2: 0
      },
      checkList: [],
      selected: '',
      id: this.$route.params.id,
      list: [],
      choose: {},
      accountList: [],
      account: {},
      date: null,
      startX: null,
      disX: 0,
    }
  },
  created() {
    this.openMoney()
  },
  computed: {
    checked() {
      return this.selected != ''
    },
    totalMoney() {
      let sum = 0
      this.list.forEach(i => {
        if (i.id == this.selected.id && i.val1) {
          sum = Number(i.val1)
        }
      }
      )
      return sum
    },
  },
  methods: {
    // 获取公司相关信息
    async openMoney() {
      const [acct, perms] = await this.$axios.all([this.getAccount(), this.getSale()])
      console.log(acct, perms)
      this.accountList = acct.data.data
      this.list = perms.data.data
      console.log(this.list)
    },
    /**
    * 获取账号信息
    * @method getAccount
    */
    getAccount() {
      return this.$axios.get('http://192.168.0.199:7076/financeTable/showPaymentAccount', {
        params: { tenantId: this.GLOBAL.token.tenantId }
      })
    },
    /**
    * 获取销售单
    * @method getSale
    */
    getSale() {
      return this.$axios.get('http://192.168.0.199:7077/sell/showSellReceivable/' + this.id)
    },
    // 选择单号
    select(v) {
      if (this.selected.id == v.id) {
        this.selected = ''
      } else {
        this.selected = v
      }
    },
    //选择账户
    chooseAccount(data) {
      this.account = data
      this.visible.account = false;
    },
    // 选择金额
    chooseMoney(v) {
      this.visible.pay = true
      this.payInfo.val1 = v.val1
      this.payInfo.val2 = v.val2
      this.choose = v
    },
    payOk() {
      this.visible.pay = false
      this.payInfo.val1 = this.payInfo.val1 ? Number(this.payInfo.val1) : 0
      this.payInfo.val2 = this.payInfo.val2 ? Number(this.payInfo.val2) : 0
      this.$set(this.choose, 'val1', this.payInfo.val1)
      this.$set(this.choose, 'val2', this.payInfo.val2)
    },
    /**
    * 收款
    * @method getMoney
    */
    async getMoney() {
      if (!this.GLOBAL.role.erp_pay_new) return this.$toast.fail('没有权限')
      if (this.selected == '') return this.$toast.text('请选择付款销售单');
      if (!Object.keys(this.account).length > 0) return this.$toast.text('请选择账户');
      if (!this.selected.val1) return this.$toast.text('请输入此次付款金额');
      let data = {
        tenantId: this.GLOBAL.token.tenantId,
        creatorId: this.GLOBAL.token.id,
        toAccountName: this.account.name,
        toAccountType: this.account.displayName,
        toPaymentAccountId: this.account.id,
        updateTime: new Date(),
        pushTime: new Date(),
        type: 9,
        reffer: '' + this.selected.id,
        money: Number(this.selected.val1),
        fromAccountName: 'undefined',
        fromAccountType: 'undefined',
      };
      console.log(data)
      const res = await this.$axios.post('http://192.168.0.199:7076/financeTable/addFinanceTable', data)
      console.log(res)
      if (res.data && res.data.data) {
        this.postPayPrice()
      } else {
        this.$toast.fail('操作失败')
      }
    },
    //销售付款
    async postPayPrice() {
      let data = {
        sellForm: {
          id: this.selected.id,
          preferentialAmount: this.selected.val2,
          prepayAmount: this.selected.prepayAmount + this.selected.val1,
          receivableAmount: this.selected.receivableAmount - this.selected.val2 - this.selected.val1,
        },
        collectMoney: {
          actualMoney: this.selected.val1,
          discountPrice: this.selected.val2,
          operatorId: this.GLOBAL.token.id,
          orderSn: this.selected.orderNo,
        }
      }
      const res = await this.$axios.post('http://192.168.0.199:8066/storeOutForm/Receivables', data)
      console.log(res)
      if (res.data && res.data.data) {
        this.selected = ''
        this.$toast.success('收款完成')
        // this.openMoney()
        this.$router.back(-1)
      }
    },
    //返回
    back() {
      this.$router.back(-1)
    }
  }
}
</script>

<style scoped lang="scss">
#col2 {
  min-height: 100%;
  >>> .nut-dialog {
    width: 4.8rem;
    .nut-dialog-body {
      padding: 0.3rem 0.3rem 0;
      .nut-dialog-title {
        font-size: 0.28rem;
      }
      p {
        text-align: left;
        font-size: 0.24rem;
        line-height: 0.3rem;
        color: #999999;
      }
    }
    .nut-dialog-footer {
      height: 0.8rem;
      line-height: 0.8rem;
    }
    input {
      height: 0.6rem;
      margin-bottom: 0.1rem;
      background-color: #f5f5f5;
      border: none;
      width: 100%;
      padding-left: 0.2rem;
      border-radius: 0.02rem;
    }
  }
  .item2 {
    line-height: 1rem;
    font-size: 12px;
    color: rgba(102, 102, 102, 1);
    display: flex;
    padding: 0 0.3rem;
    height: 1rem;
    .n2 {
      flex: 2;
    }
    .v2 {
      flex: 1;
    }
    .v3 {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      text-align: center;
      span {
        line-height: 0.4rem;
      }
    }
  }
  .item {
    height: 1rem;
    position: relative;
    line-height: 1rem;
    padding-left: 1.8rem;
    padding-right: 0.3rem;
    .n {
      position: absolute;
      top: 0;
      left: 0;
      padding: 0 0.3rem;
      color: #999999;
    }
    .v {
      height: 100%;
      text-align: right;
      input {
        width: 100%;
        text-align: right;
      }
    }
  }
  .btn {
    padding: 1rem 0.76rem 0;
  }
}
</style>
