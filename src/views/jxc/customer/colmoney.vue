<template>
  <div id="col">
    <div class="title">收款金额</div>
    <div class="item borBom">
      <span class="n">实付金额</span>
      <div class="v" @click="visible.money = true">
        <span>￥{{ payMoney ? payMoney : list.receivableAmount }}</span>
        <i class="iconfont iconyou"></i>
      </div>
    </div>
    <div class="item borBom">
      <span class="n">优惠金额</span>
      <div class="v">
        <input type="text" v-model="discount" placeholder="请输入优惠金额" />
      </div>
    </div>
    <div class="item borBom">
      <span class="n">收款账户</span>
      <div class="v" @click="visible.account = true">
        {{ account.name ? account.name : '选择账户' }}
        <i class="iconfont iconyou"></i>
      </div>
    </div>
    <div class="item borBom">
      <span class="n">收款时间</span>
      <div class="v" @click="visible.date = true">
        {{ date ? date : '选择日期' }}
        <i class="iconfont iconyou"></i>
      </div>
    </div>
    <div class="item borBom">
      <span class="n">备注</span>
      <div class="v">
        <input type="text" v-model="memo" />
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
      @close="visible.account = false"
      @choose="chooseAccount"
    ></nut-actionsheet>
    <!-- 选择日期 -->
    <nut-datepicker
      :is-visible="visible.date"
      title="请选择日期"
      type="date"
      startDate="2010-01-01"
      endDate="2030-12-31"
      :defaultValue="now"
      @close="visible.date = false"
      @choose="chooseDate"
    ></nut-datepicker>
    <!-- 修改实付金额 -->
    <nut-dialog
      title="实付金额"
      :visible="visible.money"
      @ok-btn-click="visible.money = false"
      @cancel-btn-click="visible.money = false"
      @close="visible.money = false"
    >
      <span style="font-size:0.24rem">¥{{ payMoney ? payMoney : list.receivableAmount }}</span>
      <input type="text" v-model="payMoney" placeholder="请输入付款金额" />
    </nut-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'colmoney',
  data() {
    return {
      payMoney: '',
      discount: '',
      memo: '',
      visible: {
        account: false,
        date: false,
        money: false
      },
      accountList: [],
      account: {},
      date: null,
      list: {}
    }
  },
  created() {
    if (!this.$route.params.obj) {
      this.$router.back(-1)
    } else {
      this.list = JSON.parse(decodeURIComponent(this.$route.params.obj))
      this.getAccount()
    }
  },
  computed: {
    now() {
      let now = moment().format('YYYY-MM-DD')
      return now
    },
  },
  methods: {
    /**
     * 获取账号信息
     * @method getAccount
     */
    async getAccount() {
      const res = await this.$axios.get(
        'http://192.168.0.199:7076/financeTable/showPaymentAccount',
        {
          params: { tenantId: this.GLOBAL.token.tenantId }
        }
      )
      console.log(res)
      this.accountList = res.data.data
    },
    //选择账户
    chooseAccount(data) {
      console.log(data)
      this.account = data
      this.visible.account = false
    },
    //选择日期
    chooseDate(data) {
      console.log(data)
      this.date = data[3]
      this.visible.date = false
    },
    /**
     * 收款
     * @method getMoney
     */
    async getMoney() {
      if (!Object.keys(this.account).length > 0)
        return this.$toast.text('请选择账户')
      if (!this.date) return this.$toast.text('请选择收款时间')
      if (!this.payMoney) return this.$toast.text('请输入此次付款金额')
      let data = {
        tenantId: this.GLOBAL.token.tenantId,
        creatorId: this.GLOBAL.token.id,
        toAccountName: this.account.name,
        toAccountType: this.account.displayName,
        toPaymentAccountId: this.account.id,
        updateTime: this.date,
        pushTime: this.date,
        type: 9,
        reffer: '' + this.list.id,
        money: this.payMoney,
        fromAccountName: 'undefined',
        fromAccountType: 'undefined'
      }
      console.log(data)
      const res = await this.$axios.post(
        'http://192.168.0.199:7076/financeTable/addFinanceTable',
        data
      )
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
          id: this.list.id,
          preferentialAmount: Number(this.discount),
          prepayAmount: Number(this.list.prepayAmount) + Number(this.payMoney),
          receivableAmount:
            Number(this.list.receivableAmount) - Number(this.discount) - Number(this.payMoney)
        },
        collectMoney: {
          actualMoney: Number(this.payMoney),
          discountPrice: Number(this.discount),
          operatorId: this.GLOBAL.token.id,
          orderSn: this.list.orderNo,
          memo: this.memo
        }
      }
      const res = await this.$axios.post(
        'http://192.168.0.199:8066/storeOutForm/Receivables',
        data
      )
      console.log(res)
      if (res.data && res.data.data) {
        this.$toast.success('收款完成')
        // this.openMoney()
        this.$router.back(-1)
      }
    }
  }
}
</script>

<style scoped lang="scss">
#col {
  min-height: 100%;
  .title {
    height: 0.6rem;
    line-height: 0.6rem;
    background-color: #f5f5f5;
    font-size: 0.24rem;
    font-weight: 700;
    padding-left: 0.3rem;
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

  >>> .nut-dialog {
    width: 4.8rem;
    height: 2.86rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 6px 6px;
    .nut-dialog-title {
      padding: 0;
      line-height: 0.28rem;
      font-size: 0.28rem;
    }
    .nut-dialog-content {
      padding: 0;
      span {
        margin-top: 0.1rem;
      }
    }
    .nut-dialog-body {
      padding: 0.3rem;
    }
    .nut-dialog-footer {
      height: 0.8rem;
    }
    input {
      width: 4.2rem;
      height: 0.6rem;
      background: rgba(245, 245, 245, 1);
      padding-left: 0.2rem;
      border-radius: 1px;
      margin-top: 0.3rem;
    }
  }

  >>> .nut-picker-list .nut-picker-indicator {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
}
</style>
