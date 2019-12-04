<template>
  <div id="col">
    <div class="item">
      <span class="n">客户名称</span>
      <div class="v">
        <p>上海鸿树木业有限公司</p>
      </div>
    </div>
    <div style="height: 0.44rem;background-color: #F5F5F5"></div>
    <div class="item borBom">
      <span class="n">收款金额</span>
      <div class="v">
        <span>¥1985.00</span>
      </div>
    </div>
    <div class="item borBom">
      <span class="n">收款账户</span>
      <div class="v" @click="visible.account=true">
        {{account.value?account.value:'选择账户'}}
        <i class="iconfont icon-pingbi2"></i>
      </div>
    </div>
    <div class="item borBom">
      <span class="n">收款时间</span>
      <div class="v" @click="visible.date=true">
        {{date?date:'选择日期'}}
        <i class="iconfont icon-pingbi2"></i>
      </div>
    </div>
    <div class="item">
      <span class="n">备注</span>
      <div class="v">
        <input type="text" placeholder="备注" />
      </div>
    </div>
    <div class="btn">
      <nut-button block shape="circle">确定</nut-button>
    </div>
    <!-- 选择账户 -->
    <nut-actionsheet
      :is-visible="visible.account"
      :menu-items="accountList"
      optionTag="value"
      :chooseTagValue="account.value"
      @close="visible.account=false"
      @choose="chooseAccount"
    ></nut-actionsheet>
    <!-- 选择日期 -->
    <nut-calendar
      :is-visible="visible.date"
      :default-value="date"
      :is-auto-back-fill="true"
      @close="visible.date=false"
      @choose="chooseDate"
    ></nut-calendar>
  </div>
</template>

<script>
export default {
  name: "colmoney",
  data() {
    return {
      visible: {
        account: false,
        date: false
      },
      accountList: [{ id: 1, value: '中国工商银行' }, { id: 2, value: '中国建设银行' }, { id: 3, value: '中国交通银行' }, { id: 4, value: '中国农业银行' }],
      account: {},
      date: null,
      startX: null,
      disX: 0,
    }
  },
  methods: {
    //选择账户
    chooseAccount(data) {
      this.account = data;
      this.visible.account = false;
    },
    //选择日期
    chooseDate(data) {
      console.log(data);
      this.date = data[3];
      this.visible.date = false
    }
  }
}
</script>

<style scoped lang="scss">
#col {
  min-height: 100%;
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
      span {
        color: #ed273a;
      }
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
