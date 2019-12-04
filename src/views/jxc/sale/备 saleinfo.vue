<template>
  <div id="saleinfo">
    <div class="top">
      <div class="tit">
        <p>订单编号：XS158</p>
      </div>
      <div class="card_step">
        <step :steps="steps"></step>
      </div>
    </div>
    <!-- 订单明细 -->
    <div class="info">
      <div class="info_top borBom">
        <p class="p1">
          订单明细
          <i @click="visible.order=!visible.order" class="iconfont icon-pingbi2"></i>
        </p>
        <p class="p2">
          <span>实木板材</span>
          <span>太仓仓库</span>
          <span>地址：北环路</span>
        </p>
      </div>
      <div v-if="visible.order" class="info_main borBom" v-for="k in 3" :key="k">
        <p class="p1">
          <span>品牌</span>
          <span>品名</span>
          <span>品类</span>
        </p>
        <p>
          <span>规格：20*200*200</span>
          <span class="info_price">
            <i>￥1520</i>/m³
          </span>
        </p>
        <p>
          <span>数量：2.154m³(100支)*3件</span>
        </p>
      </div>
      <div class="info_btm">
        <span>共10件商品</span>
        <span>共10件商品</span>
        <span>
          合计：
          <i>￥124522</i>
        </span>
      </div>
    </div>
    <div style="height: 0.3rem;background-color: #F5F5F5"></div>
    <!-- 出货单明细 -->
    <div class="info">
      <div class="info_top borBom">
        <p class="p1">
          出货单明细
          <i @click="visible.sell=!visible.sell" class="iconfont icon-pingbi2"></i>
        </p>
        <p class="p2">
          <span>实木板材</span>
          <span>太仓仓库</span>
          <span>地址：北环路</span>
        </p>
      </div>
      <div v-if="visible.sell" class="info_main borBom" v-for="k in 3" :key="k">
        <p class="p1">
          <span>品牌</span>
          <span>品名</span>
          <span>品类</span>
        </p>
        <p>
          <span>规格：20*200*200</span>
          <span class="info_price">
            <i>￥1520</i>/m³
          </span>
        </p>
        <p>
          <span>数量：2.154m³(100支)*3件</span>
        </p>
      </div>
      <div class="info_btm">
        <span>共10件商品</span>
        <span>共10件商品</span>
        <span>
          合计：
          <i>￥124522</i>
        </span>
      </div>
    </div>
    <div style="height: 0.3rem;background-color: #F5F5F5"></div>
    <!-- 付款信息 -->
    <div class="payinfo">
      <div class="payinfo_top borBom">付款信息</div>
      <p>
        价格是否含税
        <span>含税</span>
      </p>
      <p>
        结算方式
        <span>先打款后装车</span>
      </p>
      <p>
        付款方式
        <span>线下打款</span>
      </p>
      <p>
        折扣金额合计
        <span>¥9.00</span>
      </p>
      <p>
        订单合计
        <span>¥50380.00</span>
      </p>
      <p>
        已付金额
        <span>¥0.00</span>
      </p>
      <p>
        待收金额
        <span style="color: #ED273A">¥50380.00</span>
      </p>
    </div>
    <div style="height: 0.3rem;background-color: #F5F5F5"></div>
    <!-- 物流信息 -->
    <div class="payinfo">
      <div class="payinfo_top borBom">物流信息</div>
      <p class="borBom cp">
        物流车号
        <span>苏AK02345</span>
      </p>
    </div>
    <div class="btninfo">
      <nut-button block shape="circle" @click="no">审核不通过</nut-button>
      <br />
      <br />
      <nut-button block shape="circle" @click="ok">审核通过</nut-button>
    </div>
    <!--  -->
  </div>
</template>

<script>
import step from '../../../components/step'
export default {
  name: "saleinfo",
  data() {
    return {
      visible: {
        order: true,
        sell: true
      },
      steps: [
        { step: 1, txt: '审核', type: 'wait' },
        { step: 2, txt: '理货', type: 'process' },
        { step: 3, txt: '确认', type: 'finish' },
        { step: 4, txt: '收款', type: 'error' },
      ]
    }
  },
  methods: {
    //审核不通过
    no() {
      let _this = this;
      this.$dialog({
        title: "确定审核不通过？",
        onOkBtn(event) {
          _this.steps[0].type = 'error';
          this.close();
        },
      })
    },
    //审核通过
    ok() {
      let _this = this;
      this.$dialog({
        title: "确定审核通过？",
        onOkBtn(event) {
          _this.steps[1].type = 'finish';
          this.close();
        },
      })
    }
  },
  components: {
    step
  }
}
</script>

<style scoped lang="scss">
#saleinfo {
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  .top {
    margin: 0.3rem;
    height: 1.94rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 10px 0px rgba(51, 51, 51, 0.12);
    border-radius: 0.12rem;
    .tit {
      height: 0.5rem;
      line-height: 0.5rem;
      padding-left: 0.32rem;
      // background: rgba(245, 245, 245, 1);
      background-image: repeating-linear-gradient(
        -45deg,
        #f5f5f5,
        #f5f5f5 0.05rem,
        rgba(57, 134, 239, 0.1),
        rgba(57, 134, 239, 0.1) 0.1rem
      );
      border-radius: 0.12rem 0.12rem 0 0;

      p {
        height: 0.24rem;
        font-size: 0.24rem;
        font-family: Source Han Sans CN;
        color: #999999;
      }
    }
  }
  .info {
    background-color: #ffffff;
  }
  .info_top {
    padding: 0.2rem 0.3rem;
    .p1 {
      font-size: 0.32rem;
      font-weight: 600;
      line-height: 0.6rem;
      color: #333;
      i {
        float: right;
      }
    }
    .p2 {
      font-size: 0.24rem;
      color: #999999;
      line-height: 0.6rem;
      span {
        margin-right: 0.2rem;
      }
      span:first-child {
        color: #333333;
      }
    }
  }
  .info_main {
    padding: 0.2rem 0.3rem;
    p {
      color: #333333;
      font-size: 0.28rem;
      line-height: 0.6rem;
    }
    .p1 {
      color: #999999;
      span {
        line-height: 0.4rem;
        padding-left: 0.2rem;
        padding-right: 0.2rem;
        background-color: #e5e5e5;
        border-radius: 0.4rem;
        margin-right: 0.2rem;
      }
    }
    .info_price {
      float: right;
      i {
        color: #ed273a;
      }
    }
  }
  .info_btm {
    height: 0.9rem;
    padding-right: 0.3rem;
    text-align: right;
    line-height: 0.9rem;
    font-size: 0.24rem;
    span {
      margin-left: 0.2rem;
      i {
        color: #ed273a;
      }
    }
  }
  .payinfo_top {
    font-size: 0.32rem;
    font-weight: 600;
    color: #333333;
    line-height: 1rem;
    padding-left: 0.2rem;
  }
  .payinfo p {
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    font-size: 0.24rem;
    color: #999999;
    line-height: 0.6rem;
    span {
      float: right;
      color: #666666;
    }
  }
  .payinfo .cp {
    line-height: 1rem;
  }
  .btninfo {
    padding: 0.6rem 0.75rem;
  }
}
</style>
