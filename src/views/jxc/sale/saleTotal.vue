<template>
  <div class="saletotal">
    <div class="year" style="height: 0.44rem;background-color: #F5F5F5">2019年</div>
    <div class="group">
      <div class="item borBom" v-for="v in data" :key="v.month">
        <div class="left">
          <i class="iconfont iconbaifenbihuanxingtu-copy" style="color:#3482EE"></i>
          <span>{{v.month}}月</span>
        </div>
        <div class="right">
          <p>{{v.total}}</p>
          <p>
            数量：
            <span>{{v.orderPackages}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      data: []
    }
  },
  created() {
    this.getTotal()
  },
  methods: {
    async getTotal() {
      const res = await this.$axios.get('http://192.168.0.199:7077/customerCompany/showTotalSell/' + this.id)
      console.log(res)
      this.data = res.data.data
    }
  }
}
</script>

<style scoped lang="scss">
.saletotal {
  .year {
    padding-left: 0.3rem;
    line-height: 0.44rem;
    font-size: 12px;
    font-family: Source Han Sans CN;
    color: rgba(153, 153, 153, 1);
  }
  .group {
    .item {
      line-height: 1.1rem;
      height: 1.1rem;
      padding: 0 0.4rem;
      position: relative;
      .left {
        font-size: 0.28rem;
        line-height: 1.1rem;
        height: 1.1rem;
        font-family: Source Han Sans CN;
        color: rgba(51, 51, 51, 1);
        i {
          font-size: 0.4rem;
        }
        span {
          padding: 0 5px;
        }
      }
      .right {
        position: absolute;
        top: -0.15rem;
        right: 0.4rem;
        p {
          font-size: 0.3rem;
          text-align: right;
          height: 0.36rem;
          font-family: Source Han Sans CN;
          font-weight: 500;
          color: rgba(52, 130, 238, 1);
          &:last-child {
            font-size: 0.24rem;
            color: #999999;
          }
        }
      }
    }
  }
}
</style>
