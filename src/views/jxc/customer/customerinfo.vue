<template>
  <div id="cusinfo">
    <div class="top">
      <i class="iconfont iconguanbi" @click="back"></i>
      <div class="img">
        <img v-if="data.logo!=undefined" :src=" data.logo| imgUrl" alt />
      </div>
      <p>{{ data.fullName }}</p>
      <p class="pp">
        <span>应收</span>
        {{ data.receivableAmount?data.receivableAmount:0 }}
      </p>
    </div>
    <div class="itembox">
      <!-- <div class="item borBom">
        <span class="n">预付金额</span>
        <p class="v">0.00</p>
      </div>-->
      <div class="item borBom">
        <span class="n">累计销售</span>
        <p class="v">{{ data.totalMoney?data.totalMoney:0 }}</p>
      </div>
      <div class="item borBom">
        <span class="n">联系人信息</span>
        <p class="v" style="color: #333333">{{ data.displayName }}（{{ data.phone }}）</p>
      </div>
      <div class="item borBom" @click="jump('cusmoreinfo', data.id)">
        <span class="n">客户详情</span>
        <i class="iconfont iconyou"></i>
      </div>
    </div>
    <div class="btnbox">
      <nut-button block shape="circle" type="light" color="#3482EE">销售</nut-button>
      <br />
      <br />
      <nut-button block shape="circle" @click="visible.receivables = true">收款</nut-button>
    </div>
    <!-- 收款弹窗 -->
    <nut-dialog
      title="客户收款"
      :noFooter="true"
      :visible="visible.receivables"
      @close="visible.receivables = false"
    >
      <i class="iconfont iconguanbi" @click="visible.receivables = false"></i>
      <div class="dialog1">
        <div class="left">
          <div class="dd" @click="jump('colmoney2', data.id)">
            <i class="iconfont iconxiaoshouyingshou"></i>
          </div>
          <p>销售应收</p>
        </div>
        <!-- <div class="right">
          <div class="dd" @click="jump('colmoney',id)">
            <i class="iconfont iconxiaoshouyingshou"></i>
          </div>
          <p>预收款</p>
        </div>-->
      </div>
    </nut-dialog>
  </div>
</template>

<script>
export default {
  name: 'customerinfo',
  data() {
    return {
      visible: {
        receivables: false
      },
      id: this.$route.params.id,
      data: {}
    }
  },
  created() {
    this.getCusById()
  },
  methods: {
    // 获取客户基本信息
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
      }
    },
    //返回客户列表
    back() {
      this.$router.back(-1)
    },
    //跳收款,详情
    jump(name, id) {
      this.$router.push({
        name: name,
        params: { id: id }
      })
    }
  }
}
</script>

<style scoped lang="scss">
#cusinfo {
  .top {
    height: 5rem;
    background: linear-gradient(
      rgba(52, 130, 238, 1) 0%,
      rgba(93, 159, 243, 1) 100%
    );
    border-bottom-left-radius: 0.8rem;
    position: relative;
    overflow: hidden;
    text-align: center;
    i {
      position: absolute;
      top: 0.4rem;
      right: 0.4rem;
      color: #ffffff;
    }
    .img {
      width: 1.4rem;
      height: 1.4rem;
      border: 2px solid #ffffff;
      border-radius: 100%;
      background-color: #ffffff;
      margin: 1.28rem auto 0.4rem;
      box-shadow: 0 0 2px 5px rgba(255, 255, 255, 0.5),
        0 0 0px 10px rgba(255, 255, 255, 0.2);
      img {
        width: 100%;
      }
    }
    p {
      color: #ffffff;
      font-size: 0.32rem;
    }
    .pp {
      font-size: 0.28rem;
      margin-top: 0.6rem;
      span {
        color: #cccccc;
        margin-right: 0.3rem;
      }
    }
  }
  .itembox {
    padding: 0 0.3rem;
    .item {
      height: 1rem;
      line-height: 1rem;
      font-size: 0.28rem;
      position: relative;
      padding-left: 2rem;
      .n {
        position: absolute;
        top: 0;
        left: 0;
        color: #999999;
        padding: 0 0.2rem;
      }
      .v {
        text-align: right;
        padding-right: 0.2rem;
        color: #ed273a;
      }
      i {
        position: absolute;
        right: 0.2rem;
      }
    }
  }
  .btnbox {
    padding: 1rem 0.76rem;
    .nut-button:last-child {
      box-shadow: 0px 4px 10px 0px rgba(53, 130, 238, 0.5);
    }
  }
  >>> .nut-dialog {
    width: 3.9rem;
    height: 142px;
    position: relative;
    .nut-dialog-body {
      padding: 0.4rem;
      .nut-dialog-title {
        padding: 0;
        line-height: 1;
      }
    }
    .iconguanbi {
      position: absolute;
      top: 0.3rem;
      right: 0.3rem;
      font-weight: 700;
    }
  }
  .dialog1 {
    overflow: hidden;
    padding: 0.4rem;
    padding-bottom: 0;
    text-align: center;
    // .left {
    //   float: left;
    // }
    // .right {
    //   float: right;
    // }
    i {
      font-size: 0.8rem;
      color: rgba(68, 137, 247, 1);
    }
    p {
      color: #333333;
      font-size: 0.24rem;
    }
  }
}
</style>
