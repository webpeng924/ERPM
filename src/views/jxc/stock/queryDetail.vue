<template>
  <div class="queryDetail">
    <div class="top">
      <div class="tit">
        包号:
        <span>{{ data.packageNo }}</span>
      </div>
    </div>
    <div class="main">
      <div class="item borBom">
        <div class="left">
          品类：
          <span>{{ data.品类 }}</span>
        </div>
        <div class="right">
          树种：
          <span>{{ data.树种 }}</span>
        </div>
      </div>
      <div class="item borBom">
        <div class="left">
          品牌：
          <span>{{ data.品牌 }}</span>
        </div>
        <div class="right">
          等级：
          <span>{{ data.等级 }}</span>
        </div>
      </div>
      <div class="item borBom">
        <div class="left">
          规格：
          <span>{{ data.厚度 }}*{{ data.宽度 }}*{{ data.长度 * 1000 }}</span>
        </div>
        <div class="right">
          立方数：
          <span>{{ data.立方数 }}</span>
        </div>
      </div>
      <div class="item borBom">
        <div class="left">
          片数：
          <span>{{ data.片数 }}</span>
        </div>
        <div class="right">
          库龄：
          <span>{{ timeLength }}</span>
        </div>
      </div>
      <div class="item borBom">
        <div class="left">
          指导单价：
          <span style="color:#ED273A;">{{ data.suggestPrice }}</span>
        </div>
        <div class="right">
          入库时间：
          <span>{{ data.storeInTime }}</span>
        </div>
      </div>
      <div class="item">
        <div class="left">
          备注：
          <span>{{ data.memo }}</span>
        </div>
      </div>
      <div style="height: 0.44rem;background-color: #F5F5F5"></div>
      <div class="item borBom">
        <div class="left textover">
          合同号：
          <span>{{ data.contractSn }}</span>
        </div>
      </div>
      <div class="item borBom">
        <div class="left">
          提单号：
          <span>{{ data.outterNo }}</span>
        </div>
      </div>
      <div class="item borBom">
        <div class="left">
          柜号：
          <span>{{ data.boxNo }}</span>
        </div>
      </div>
      <div class="item borBom">
        <div class="left">
          开证公司：
          <span>{{ data.issuingName }}</span>
        </div>
      </div>
      <div class="item borBom" style="position:relative;">
        <div class="left">
          实时成本：
          <span v-if="price" style="color:#ED273A;">{{ buyPrice }}</span>
          <span v-else style="color:#ccc;">待查询</span>
          <span style="position: absolute;right: 0.3rem;top: 0.3rem" @click="showPrice">
            <i class="iconfont iconshuaxin"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      price: false,
      buyPrice: '',
      id: this.$route.params.id
    }
  },
  computed: {
    timeLength() {
      var Time =
        new Date().getTime() -
        parseInt(new Date(this.data.storeInTime).getTime())
      let timeDay = parseInt(Time / 1000 / 60 / 60 / 24)
      return timeDay ? timeDay : ''
    }
  },
  created() {
    this.getPrice()
  },
  methods: {
    async getPrice() {
      const res = await this.$axios.get(
        'http://192.168.0.199:8066/storePackage/showWarehouseInventoryPackages',
        {
          params: {
            tenantId: this.GLOBAL.token.tenantId,
            id: this.id,
            priceState: 1,
            attribute: '品类:实木板材'
          }
        }
      )
      if (res.data && res.data.data) {
        this.data = res.data.data
        this.buyPrice = res.data.data.buyPrice
        this.data.storeInTime = this.data.storeInTime.split('T')[0]
        let arr = this.data.attributeValue.split(',')
        arr.forEach(i => {
          if (i !== '') {
            this.data[i.split(':')[0]] = i.split(':')[1]
          }
        })
      }
      console.log(this.data)
    },
    showPrice() {
      if (!this.GLOBAL.role.erp_store_money) return this.$toast.fail('没有查看权限')
      this.price = true
    }
  }
}
</script>

<style scoped lang="scss">
.queryDetail {
  height: 100%;
  background-color: #f5f5f5;

  .top {
    background-color: #ffffff;
    padding: 0.3rem;
    .tit {
      padding-left: 0.3rem;
      height: 0.6rem;
      line-height: 0.6rem;
      background: linear-gradient(
        90deg,
        rgba(93, 159, 243, 1) 0%,
        rgba(52, 130, 238, 1) 100%
      );
      border-radius: 0.3rem;
      color: #fff;
      span {
        font-size: 14px;
        font-family: PingFang SC;
      }
    }
  }
  .main {
    background-color: #ffffff;
    .item {
      padding: 0.3rem;
      height: 0.9rem;
      display: flex;
      box-sizing: border-box;
      color: #a0a0a0;
      .left {
        flex: 1;
      }
      .right {
        flex: 1;
      }
      span {
        color: #333333;
      }
    }
  }
}
</style>
