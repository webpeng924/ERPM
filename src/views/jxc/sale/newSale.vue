<template>
  <div id="newsale">
    <div class="item">
      <span class="n">客户</span>
      <!-- <input class="v" placeholder="输入或者选择客户" v-model="cusName" /> -->
      <div class="v" :class="{color:cus}" @click="visible.custom=true">{{cus?cus.fullName:'选择客户'}}</div>
      <i class="iconfont iconyou" @click="visible.custom=true"></i>
    </div>
    <div style="height: 0.3rem;background-color: #F5F5F5"></div>
    <div class="item borBom">
      <span class="n">车号</span>
      <input class="v" placeholder="(必填)" v-model="carNo" />
    </div>
    <div class="item borBom">
      <span class="n">外部单号</span>
      <input class="v" placeholder="(必填)" v-model="orderNo" />
    </div>
    <div class="item borBom">
      <span class="n">是否含税</span>
      <nut-switch
        :active="visible.tax"
        @change="(val)=>{visible.tax=val}"
        class="my_switch"
        style="position: absolute;right: 0.3rem;top: 0.3rem"
      ></nut-switch>
    </div>
    <div class="item borBom">
      <span class="n">备注</span>
      <input class="v" placeholder="请输入信息" />
    </div>
    <div style="height: 0.3rem;background-color: #F5F5F5"></div>
    <div class="item borBom">
      <span class="n">添加商品</span>
      <i @click="visible.addgoods = true" class="iconfont iconjia" style="font-size:0.45rem;"></i>
    </div>
    <div class="goods borBom" v-for="k in chooseList" :key="k.id">
      <i class="remove iconfont iconshanchu" @click="del(k.id)"></i>
      <p class="p2">
        <span>{{k.品牌}}</span>
        <span>{{k.树种}}</span>
        <span>{{k.等级}}</span>
      </p>
      <p class="p3">
        <span>规格：{{k.厚度}}*{{k.宽度}}*{{k.长度*1000}}</span>
        <span>{{k.片数}}支/{{k.amount}} m³</span>
      </p>
      <p class="p4">
        可售:
        <span>{{k.packageNumber-k.lockedNumber}}</span>件&nbsp;&nbsp;&nbsp;&nbsp;
        <span style="color:#999">
          数量
          <span class="ss" style="color:#333;" @click="addMore(k)">{{k.number}}</span>件&nbsp;&nbsp;&nbsp;&nbsp;
          单价
          <span
            class="ss"
            style="color:#333;"
            @click="addMore(k)"
          >{{k.price}}</span>
        </span>
      </p>
      <p class="p1">
        <i class="iconfont icondizhi"></i>
        {{k.warestoreName}}
      </p>
    </div>
    <div class="item borBom">
      <span class="s">
        合计:
        <span>￥{{totalPrice}}</span>
      </span>
      <span class="s">共{{cubicAll}}m3</span>
      <span class="s">共{{chooseList?chooseList.length:0}}件商品</span>
    </div>
    <div class="btn">
      <nut-button block shape="circle" @click="submit">提交</nut-button>
    </div>
    <!-- 客户列表 -->
    <transition name="cus">
      <div class="customer" v-if="visible.custom">
        <custom @next="setCus"></custom>
      </div>
    </transition>
    <!-- 添加商品 -->
    <transition name="cus">
      <div class="customer" v-if="visible.addgoods">
        <addgoods @next="setGoods" :chooseL="chooseList"></addgoods>
      </div>
    </transition>
    <!-- 选择商品 -->
    <nut-actionsheet :is-visible="visible.updategoods" @close="visible.updategoods=false">
      <div slot="custom" class="updategoods_warp">
        <div class="goodsInfo">
          <p class="p1">
            {{choose.品类}}
            <i @click="visible.updategoods=false" class="iconfont iconguanbi"></i>
          </p>
          <p class="p2">
            <span>{{choose.品牌}}</span>
            <span>{{choose.树种}}</span>
            <span>{{choose.等级}}</span>
          </p>
          <p class="p3">
            <span>规格：{{ choose.厚度 }}*{{ choose.宽度 }}*{{ choose.长度*1000 }}</span>
            <span>{{ choose.片数 }}支/{{ choose.amount }}m³</span>
            <span>库存：{{ choose.packageNumber }}件</span>
            <span>可售件数：{{ choose.packageNumber - choose.lockedNumber }}件</span>
          </p>
        </div>
        <div class="np">
          <span>价格</span>
          <input type="text" v-model="price" />
        </div>
        <div class="np">
          <span>数量</span>
          <nut-stepper
            style="display: inline-flex;vertical-align: middle"
            :simple="false"
            :value.sync="number"
            :min="0"
            :max="choose.packageNumber - choose.lockedNumber"
          ></nut-stepper>
        </div>
        <div class="addbtn">
          <nut-button block shape="circle" @click="addGoods">添加商品</nut-button>
        </div>
      </div>
    </nut-actionsheet>
  </div>
</template>

<script>
import custom from '../../../components/customer'
import addgoods from '../../../components/addgoods'
export default {
  name: "newSale",
  data() {
    return {
      number: 1,
      price: '',
      visible: {
        custom: false,
        addgoods: false,
        tax: false,
        updategoods: false
      },
      cus: '',
      chooseList: [],
      choose: {},
      carNo: '',
      orderNo: '',
      memo: ''
    }
  },
  computed: {
    totalPrice() {
      let sum = 0
      if (this.chooseList && this.chooseList.length > 0) {
        this.chooseList.forEach(item => {
          sum += (item.price * Number(item.number) * item.amount)
        })
      }
      return sum.toFixed(2)
    },
    cubicAll() {
      let sum = 0
      if (this.chooseList && this.chooseList.length > 0) {
        this.chooseList.forEach(item => {
          if (item.hasOwnProperty('amount'))
            sum += Number(item.amount * item.number)
        })
      }
      var reg = /\d{1,3}(?=(\d{3})+$)/g
      return (sum.toFixed(3) + '').replace(reg, '$&,')
    }
  },
  methods: {
    //接收选择的客户
    setCus(data) {
      this.visible.custom = false;
      if (data) {
        this.cus = data
      }
    },
    //接收选择的商品
    setGoods(data) {
      this.visible.addgoods = false
      this.chooseList = data
    },
    // 修改已添加
    addMore(k) {
      this.visible.updategoods = true
      console.log(this.choose)
      this.choose = k
      this.price = k.price ? k.price : ''
      this.number = k.number ? k.number : 0
    },
    // 确认添加
    addGoods() {
      if (!Number(this.price)) return this.$toast.text('请输入价格')
      this.visible.updategoods = false
      if (Number(this.number) != 0) {
        if (this.chooseList.length > 0) {
          this.chooseList = this.chooseList.filter(item => item.id != this.choose.id)
          this.chooseList.push({ ...this.choose, number: Number(this.number), price: this.price })
        } else {
          this.chooseList.push({ ...this.choose, number: Number(this.number), price: this.price })
        }
      } else {
        this.chooseList = this.chooseList.filter(item => item.id != this.choose.id)
      }
      console.log(this.chooseList)
    },
    // 删除商品
    del(id) {
      console.log(id)
      this.chooseList = this.chooseList.filter(item => item.id != id)
    },
    async submit() {
      // if(!this.GLOBAL.role.erp_sale_new) return this.$toast.fail('没有销售权限');
      console.log(this.chooseList)
      if (!this.cus) return this.$toast.fail('请选择客户');
      if (!this.carNo) return this.$toast.fail('请输入车号');
      if (this.chooseList.length === 0) return this.$toast.fail('请选择产品');
      let num = 0, price = 0, arr = [];
      this.chooseList.forEach(val => {
        num += val.number;
        price += val.number * val.price * val.amount;
        let obj = {
          packageId: val.id,
          creatorId: this.GLOBAL.token.id,
          warestoreId: val.warestoreId,
          salePrice: val.price,
          goodsNum: val.number
        };
        arr.push(obj)
      });
      let data = {
        contactId: this.cus.contactId,
        carNo: this.carNo,
        creatorId: this.GLOBAL.token.id,
        isTax: this.visible.tax ? 1 : 2,
        memo: this.memo,
        checkApproveState: 1,
        openApproveStatet: 1,
        orderNumber: this.orderNo,
        orderPackages: num,
        orderAmount: price,
        prepayAmount: 0,
        receivableAmount: price,
        preferentialAmount: 0,
        content: '',
        tenantId: this.GLOBAL.token.tenantId,
        state: 1,
        sellFormDetailList: arr,
        sellType: 0
      }

      const res = await this.$axios.post('http://192.168.0.199:7077/sell/addToSellForm', data)
      console.log(res)
      if (res.data && res.data.data) {
        this.$router.push({ name: 'newfinish', params: { id: res.data.data } })
      } else {
        this.$toast.fail('提交失败')
      }
    }
  },
  components: {
    custom, addgoods
  }
}
</script>

<style scoped lang="scss">
#newsale {
  height: 100%;
  .color {
    color: #333;
  }
  .item {
    height: 1rem;
    padding-right: 0.6rem;
    font-size: 0.28rem;
    color: #999999;
    line-height: 1rem;
    position: relative;
    .n {
      float: left;
      width: 1.2rem;
      padding: 0 0.3rem;
      height: 100%;
      vertical-align: middle;
      line-height: 1.05rem;
    }
    .v {
      float: left;
      width: calc(100% - 1.8rem);
      height: 1rem;
      vertical-align: middle;
    }
    i {
      position: absolute;
      right: 0.3rem;
    }
    .s {
      float: right;
      position: relative;
      margin-left: 0.2rem;
      color: #333333;
      font-size: 0.24rem;
      span {
        color: #ed273a;
      }
    }
  }
  .customer {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #ffffff;
  }
  .goods {
    padding: 0.2rem 0.8rem 0.2rem 0.3rem;
    position: relative;
    .p1 {
      color: #3986ef;
      font-size: 0.24rem;
      line-height: 0.5rem;
    }
    .p2 {
      line-height: 0.6rem;
      span {
        padding: 0 0.2rem;
        line-height: 0.4rem;
        font-size: 0.28rem;
        background-color: #f5f5f5;
        border-radius: 0.4rem;
        margin-right: 0.2rem;
        color: #999999;
      }
    }
    .p3 {
      font-size: 0.28rem;
      color: #333333;
      line-height: 0.5rem;
      span {
        margin-right: 0.2rem;
      }
    }
    .p4 {
      color: #333;
      font-size: 0.24rem;
      line-height: 0.6rem;
      .ss {
        width: 1rem;
        text-align: center;
        background-color: #f5f5f5;
        height: 0.4rem;
        border-radius: 0.4rem;
        // padding: 0 0.2rem;
        display: inline-block;
        vertical-align: middle;
        line-height: 0.4rem;
        margin-left: 0;
        &:last-child {
          width: 2.2rem;
          text-align: left;
          padding: 0 0.2rem;
          box-sizing: border-box;
        }
      }
      span {
        // margin-right: 0.3rem;
        i {
          color: #ed273a;
        }
      }
    }
    .remove {
      position: absolute;
      right: 0.3rem;
      font-size: 0.3rem;
      padding: 0.08rem;
      top: 1rem;
      color: #fff;
      background: #ed273a;
      border-radius: 50%;
    }
  }
  .btn {
    padding: 0.6rem;
  }
}
.updategoods_warp {
  height: 5.5rem;
  background-color: #ffffff;
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  .goodsInfo {
    width: 5.9rem;
    height: 2.2rem;
    padding: 0.4rem 0.5rem;
    border-radius: 0.3rem;
    background-color: #ffffff;
    margin: 0 auto;
    transform: translateY(-50%);
    box-shadow: 0px 8px 20px 0px rgba(51, 51, 51, 0.12);
    .p1 {
      color: #3986ef;
      font-size: 0.32rem;
      line-height: 0.5rem;
      i {
        float: right;
        color: #333333;
        font-weight: 700;
      }
    }
    .p2 {
      margin-top: 0.2rem;
      margin-bottom: 0.1rem;
      span {
        padding: 0 0.2rem;
        line-height: 0.4rem;
        border-radius: 0.4rem;
        background-color: #f5f5f5;
        color: #999999;
        margin-right: 0.2rem;
      }
    }
    .p3 {
      span {
        margin-right: 0.5rem;
        font-size: 0.28rem;
        color: #333333;
        line-height: 0.5rem;
        display: inline-block;
      }
    }
  }
  .np {
    transform: translateY(-1rem);
    height: 0.56rem;
    margin-bottom: 0.3rem;
    padding: 0 0.6rem;
    color: #333333;
    font-size: 0.28rem;
    span {
      margin-right: 0.3rem;
    }
    input {
      width: 3rem;
      height: 100%;
      background-color: #f5f5f5;
      border-radius: 1rem;
      text-indent: 1em;
      font-size: 0.28rem;
    }
  }
  .addbtn {
    transform: translateY(-1rem);
    padding: 0 0.6rem;
    margin-top: 0.6rem;
  }
}
.cus-enter,
.cus-leave-to {
  transform: translateX(100%);
}
.cus-enter-active,
.cus-leave-active {
  transition: 0.5s;
}
.cus-enter-to,
.cus-leave {
  transform: translateX(0);
}
</style>
