<template>
  <div class="saleinfol">
    <div class="top">
      <div class="tit">
        <p>订单编号：{{info.orderNo}}</p>
      </div>
      <div class="card_step">
        <!-- <step :steps="steps" :step="step"></step> -->
        <div id="step">
          <div
            class="step_item"
            :style="{width:sw}"
            :class="{blue:steps[k-1].state<=step&&steps[k-1].check<=info.checkApproveState}"
            v-for="k in steps.length"
            :key="k"
          >
            <div class="line" v-if="k!=1"></div>
            <i class="iconfont iconxuanzhong4"></i>
            <p>{{steps[k-1].txt}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="cusinfo">
      <ul>
        <li>
          <span>客户姓名</span>
          <span>{{info.fullName}}</span>
        </li>
        <li>
          <span>车号</span>
          <span>{{info.carNo}}</span>
        </li>
        <li>
          <span>销售时间</span>
          <span>{{info.createTime?info.createTime.split(' ')[0]:''}}</span>
        </li>
        <li>
          <span>收货人</span>
          <span>{{info.displayName}}</span>
        </li>
        <li>
          <span>电话</span>
          <span>{{info.phone}}</span>
        </li>
        <li>
          <span>销售员</span>
          <span>{{info.creatorName}}</span>
        </li>
      </ul>
    </div>
    <div style="height: 0.3rem;background-color: #F5F5F5"></div>
    <div class="goods borBom" v-for="k in table" :key="k.id">
      <i class="remove iconfont iconshanchu" v-show="step<=1" @click="isdel(k)"></i>
      <p class="p2">
        <span>{{k.品牌}}</span>
        <span>{{k.树种}}</span>
        <span>{{k.等级}}</span>
      </p>
      <p class="p3">
        <span>规格：{{ k.厚度 }}*{{ k.宽度 }}*{{ k.长度 * 1000 }}</span>
        <span>{{ k.片数 }}支 / {{ k.amount }} m³</span>
      </p>
      <p class="p4">
        可售:
        <span>{{k.packageNumber-k.lockedNumber+k.goodsNum}}</span>
        件&nbsp;&nbsp;&nbsp;&nbsp;
        <span v-if="step>1" style="color:#333">
          数量:
          <span>{{k.goodsNum}}</span>件&nbsp;&nbsp;&nbsp;&nbsp;
          单价:
          <span>{{k.price}}</span>
        </span>
        <span v-else style="color:#999">
          数量
          <span class="ss" style="color:#333;" @click="addMore(k)">{{k.goodsNum}}</span>件&nbsp;&nbsp;&nbsp;&nbsp;
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
        {{k.wareName}}
      </p>
    </div>
    <div style="height: 0.3rem;background-color: #F5F5F5"></div>
    <div v-if="sellFrom.length>0" class="formTitle borBom">
      出货单明细
      <span>共{{sellFrom.length}}件商品</span>
      <span>共{{cubicAll}}m³</span>
    </div>
    <div class="goods borBom" v-for="k in sellFrom" :key="k.id">
      <i class="remove iconfont iconshanchu" v-show="step<=1" @click="isdel(k)"></i>
      <p class="p2">
        <span>{{k.品牌}}</span>
        <span>{{k.树种}}</span>
        <span>{{k.等级}}</span>
      </p>
      <p class="p3">
        <span>规格：{{ k.厚度 }}*{{ k.宽度 }}*{{ k.长度 * 1000 }}</span>
        <span>{{ k.片数 }}支 / {{ k.amount }} m³</span>
      </p>
      <p class="p5">
        <span class="pp1">
          包号:
          <span style="color:#4891F0">{{k.packageNo}}</span>
        </span>
        <span class="pp2">
          单价:
          <span>{{k.salePrice}}</span>
        </span>
      </p>
    </div>
    <div style="height: 0.3rem;background-color: #F5F5F5"></div>
    <div class="money">
      <ul>
        <li>
          <span>预销售金额</span>
          <span style="color:#ED273A;">¥{{totalPrice}}</span>
        </li>
        <li>
          <span>实销售金额</span>
          <span>{{totalPrice}}</span>
        </li>
        <li>
          <span>已付金额</span>
          <span>{{info.prepayAmount}}</span>
        </li>
        <li>
          <span>待收金额</span>
          <span>¥{{info.receivableAmount}}</span>
        </li>
        <li>
          <span>优惠金额</span>
          <span>¥{{info.preferentialAmount}}</span>
        </li>
        <li>
          <span>是否含税</span>
          <span>{{info.isTax==1?'含税':'不含税'}}</span>
        </li>
        <li>
          <span>备注</span>
          <span>{{info.memo}}</span>
        </li>
      </ul>
    </div>
    <div class="btn">
      <nut-button
        v-if="step<=1"
        class="btn1"
        block
        shape="circle"
        @click="visible.dialogShow=true"
      >审核订单</nut-button>
      <nut-button
        v-else-if="step<3&&info.checkApproveState==2"
        class="btn1"
        block
        shape="circle"
        @click="visible.dialogShow=true"
      >确认</nut-button>
      <nut-button
        :class="step<=1||info.checkApproveState==2?'btn2':'btn0'"
        block
        shape="circle"
        @click="jump(info)"
      >收款</nut-button>
      <nut-button class="btn3" type="red" shape="circle" @click="visible.isMore=true">更多</nut-button>
    </div>

    <!-- 更多提示 -->
    <nut-actionsheet :is-visible="visible.isMore" cancelTxt="取消" @close="visible.isMore=false">
      <span slot="title">
        <label>更多操作</label>
      </span>
      <span slot="sub-title">
        <i class="iconfont iconfenxiang1"></i>
        <p>分享</p>
      </span>
      <span slot="sub-title" @click="showDel">
        <i class="iconfont iconshanchu"></i>
        <p>删除</p>
      </span>
    </nut-actionsheet>
    <!-- 修改商品弹窗 -->
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
            <span>可售件数：{{ choose.packageNumber - choose.lockedNumber +choose.goodsNum}}件</span>
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
            :max="choose.packageNumber - choose.lockedNumber+choose.goodsNum"
          ></nut-stepper>
        </div>
        <div class="addbtn">
          <nut-button block shape="circle" @click="addGoods">确认修改</nut-button>
        </div>
      </div>
    </nut-actionsheet>
    <!-- 删除商品确认 -->
    <nut-dialog
      title="温馨提示"
      :visible="visible.isDel"
      @ok-btn-click="del(delData)"
      @cancel-btn-click="visible.isDel=false"
      @close="visible.isDel=false"
    >
      <p>确认删除此件商品吗？</p>
    </nut-dialog>
    <!-- 确定审核弹窗 -->
    <nut-dialog
      :title="info.checkApproveState==2?'确认理货数据ok吗？':'确认审核通过吗？'"
      :visible="visible.dialogShow"
      @ok-btn-click="confirm"
      @cancel-btn-click="visible.dialogShow=false"
      @close="visible.dialogShow=false"
    ></nut-dialog>
    <!-- 销售单删除确认 -->
    <nut-dialog
      title="确认删除此销售单吗?"
      :visible="visible.delFrom"
      @ok-btn-click="delAll"
      @cancel-btn-click="visible.delFrom=false"
      @close="visible.delFrom=false"
    ></nut-dialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      delData: {},
      id: this.$route.params.id,
      step: 1,
      info: {},
      table: [],
      sellFrom: [],
      choose: {},
      number: 1,
      price: '',
      visible: {
        isMore: false,
        updategoods: false,
        isDel: false,
        delFrom: false,
        dialogShow: false
      },
      steps: [
        { state: 2, check: 1, txt: '审核' },
        { state: 2, check: 2, txt: '理货' },
        { state: 3, check: 2, txt: '确认' },
        { state: 9, check: 2, txt: '收款' },
        { state: 7, check: 2, txt: '出库' },
      ]
    }
  },
  created() {
    this.getData()
  },
  computed: {
    totalPrice() {
      let sum = 0
      if (this.table && this.table.length > 0) {
        this.table.forEach(item => {
          sum += (item.price * Number(item.goodsNum) * item.amount)
        })
      }
      return sum.toFixed(2)
    },
    sw: function () {
      return 1 / this.steps.length * 100 + '%'
    },
    cubicAll() {
      let sum = 0
      if (this.sellFrom) {
        this.sellFrom.forEach(item => {
          if (item.hasOwnProperty('amount'))
            sum += Number(item.amount)
        })
      }
      var reg = /\d{1,3}(?=(\d{3})+$)/g
      return (sum.toFixed(3) + '').replace(reg, '$&,')
    },
  },
  methods: {
    showDel() {
      this.visible.delFrom = true
      this.visible.isMore = false
    },
    // 获取数据
    async getData() {
      const res = await this.$axios.get('http://192.168.0.199:7077/sell/showSellFormInfo', {
        params: { id: this.id }
      })
      console.log(res)
      if (res.data && res.data.data) {
        let data = res.data.data;
        console.log(data, 222222222)
        this.table = this.setTable(data)
        for (let i in data) {
          this.info = this.stringToObject(i);
        }
        this.step = this.info.state
        console.log(this.info)
        if (this.info.checkApproveState == 2) {
          this.getLiData()
        }
      }
    },
    // 字符串装对象
    stringToObject(string) {
      let start = string.indexOf('(');
      let end = string.indexOf(')');
      string = string.substring(start + 1, end);
      let arr = string.split(',')
      let obj = {}
      for (let i in arr) {
        obj[arr[i].split('=')[0].replace(/\s/, '')] = arr[i].split('=')[1]
      }
      return obj
    },
    //	商品数据
    setTable(data) {
      let arr = Object.values(data).flat(Infinity)
      console.log(arr)
      arr.forEach(item => {
        let arr1 = item.arrtibuteValue.split(',')
        arr1.forEach(i => {
          if (i !== '') {
            item[i.split(':')[0]] = i.split(':')[1]
          }
        })
      })
      return arr
    },
    // 获取理货商品数据
    async getLiData() {
      let goodsId = '';
      for (let i in this.table) {
        goodsId += this.table[i].id + ','
      }
      let params = {
        sellFormId: this.id,
        goodsId: goodsId
      }
      const res = await this.$axios.get('http://192.168.0.199:7077/sell/showGoodsDetail', { params })
      console.log(res)
      if (res.data && res.data.data) {
        this.sellFrom = res.data.data
        this.sellFrom.forEach(item => {
          let arr = item.attributeValue.split(',')
          arr.forEach(i => {
            if (i !== '') {
              item[i.split(':')[0]] = i.split(':')[1]
            }
          })
        })
      }
    },
    // 修改已添加
    addMore(k) {
      this.visible.updategoods = true
      console.log(this.choose)
      this.choose = k
      this.price = k.price ? k.price : ''
      this.number = k.goodsNum ? k.goodsNum : 0
    },
    // 确认修改
    addGoods() {
      this.visible.updategoods = false
      if (!this.GLOBAL.role.erp_sale_mod) return this.$toast.fail('没有修改权限')
      if (!Number(this.price)) return this.$toast.fail('请输入价格')
      if (Number(this.number) != 0) {
        this.table = this.table.filter(item => item.id != this.choose.id)
        this.table.push({ ...this.choose, goodsNum: Number(this.number), price: this.price })
      } else {
        this.del(this.choose)
      }
      console.log(this.table)
      let data = {
        id: this.choose.sellDetailId,
        goodsNum: this.choose.goodsNum,
        packageId: this.choose.id,
        salePrice: this.price
      }
      this.modifyGoods(data)
    },
    // 修改商品
    async modifyGoods(data) {
      const res = await this.$axios.post('http://192.168.0.199:7077/sell/modifySellFormDetail', data)
      console.log(res)
      this.modifySale()
    },
    // 修改销售单
    async modifySale() {
      let num = 0
      this.table.forEach(item => {
        num += item.goodsNum
      })

      let data = {
        id: this.id,
        orderAmount: this.totalPrice,
        orderPackages: num,
        receivableAmount: this.totalPrice - this.info.prepayAmount - this.info.preferentialAmount,
        tenantId: this.GLOBAL.token.tenantId,
      }
      const res = await this.$axios.post('http://192.168.0.199:7077/sell/modifySellDetail', data)
      console.log(res)
    },
    // 删除商品确认
    isdel(data) {
      if (!this.GLOBAL.role.erp_sale_mod) return this.$toast.fail('没有修改权限')
      console.log(data)
      this.visible.isDel = true
      this.delData = data
    },
    // 删除商品
    del(data) {
      this.table = this.table.filter(item => item.id != data.id)
      console.log(this.table)
      this.visible.isDel = false
      if (this.table.length < 1) {
        // 删除销售单
        this.delAll()
      } else {
        // 修改
        let data = {
          id: this.delData.sellDetailId,
          status: 0
        }
        this.modifyGoods(data)
      }
    },
    // 审核和理货确认
    confirm() {
      this.visible.dialogShow = false
      if (!this.GLOBAL.role.erp_sale_mod) return this.$toast.fail('没有修改权限')
      if (this.step == 1) {
        // 审核
        this.step = 2
        this.createForm()
      } else {
        // 理货
        this.step = 3
      }
    },
    // 审核通过
    async createForm() {
      const res = await this.$axios.get('http://192.168.0.199:7077/sell/createStoreOutForm', {
        params: {
          sellId: this.id,
          tenantId: this.GLOBAL.token.tenantId,
          createorId: this.GLOBAL.token.id,
          openApproveStatet: 2,
          openApproverId: this.GLOBAL.token.id,
          openApproveTimeString: moment().format('YYYY-MM-DD'),
          state: 2
        }
      })
      console.log(res)
    },
    // 销售单删除确认
    async delAll() {
      const res = await this.$axios.get('http://192.168.0.199:8066/sellForm/deleteSellForm', {
        params: {
          sellFormId: this.id
        }
      })
      console.log(res)
      if (res.data && res.data.data) {
        this.$toast.text('销售单已删除');
        // this.$router.push({ name: 'salelist' })
        this.$router.back(-1)
      }
    },
    // 跳收款
    jump(v) {
      console.log(v)
      this.$router.push({
        name: 'colmoney',
        params: { id: v.id, obj: encodeURIComponent(JSON.stringify(v)) }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.saleinfol {
  #step {
    color: #e5e5e5;
    padding-top: 0.4rem;
    .step_item {
      height: 100%;
      float: left;
      text-align: center;
      position: relative;
      p {
        margin-top: 0.1rem;
      }
      i {
        position: relative;
        background-color: #ffffff;
        z-index: 2;
      }
      .line {
        border-bottom: 2px dashed;
        position: absolute;
        width: 100%;
        left: -50%;
        top: 0.13rem;
        z-index: 0;
      }
    }
    .blue {
      color: #2789ed;
    }
  }
  >>> .nut-dialog {
    width: 4.4rem;
    max-height: 2.4rem;
    .nut-dialog-title {
      font-size: 0.28rem;
    }
    .nut-dialog-body {
      padding: 0.4rem 0.4rem 0.24rem 0.4rem;
    }
    .nut-dialog-content {
      overflow: hidden;
    }
    .nut-dialog-footer {
      height: 0.8rem;
    }
  }
  >>> .nut-actionsheet-panel {
    .nut-actionsheet-modal {
      padding: 0;
      .nut-actionsheet-title {
        padding: 0.24rem;
        font-size: 0.24rem;
      }
      .nut-actionsheet-sub-title {
        height: 2.24rem;
        line-height: 1.6rem;
        display: flex;
        span {
          flex: 1;
          flex-direction: column;
          position: relative;
          i {
            font-size: 0.5rem;
            background: rgba(245, 245, 245, 1);
            border-radius: 50%;
            color: #3986ef;
            padding: 0.24rem;
          }
          p {
            line-height: 0.24rem;
            position: absolute;
            bottom: 0.5rem;
            left: 1.6rem;
          }
        }
      }
    }
    .nut-actionsheet-cancel {
      margin: 0;
      height: 0.98rem;
      line-height: 0.98rem;
      font-size: 0.36rem;
      color: #3986ef;
      padding: 0;
    }
  }
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
  .formTitle {
    height: 0.8rem;
    line-height: 0.8rem;
    padding-left: 0.32rem;
    span {
      font-size: 0.24rem;
      color: #999999;
      padding-left: 0.3rem;
    }
  }
  .cusinfo {
    padding: 0 0.32rem;
    font-size: 0.24rem;
    li {
      line-height: 0.56rem;
      display: flex;
      span {
        flex: 1;
        color: #999999;
        &:last-child {
          text-align: right;
          color: #666666;
        }
      }
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
  .goods {
    padding: 0.3rem;
    position: relative;
    .p1 {
      color: #3986ef;
      font-size: 0.24rem;
      line-height: 0.4rem;
    }
    .p2 {
      line-height: 0.5rem;
      span {
        padding: 0 0.2rem;
        line-height: 0.5rem;
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
        margin-right: 0.4rem;
      }
    }
    .p4 {
      color: #333;
      font-size: 0.24rem;
      line-height: 0.5rem;
      .ss {
        width: 1rem;
        text-align: center;
        background-color: #f5f5f5;
        height: 0.44rem;
        border-radius: 0.44rem;
        font-size: 0.28rem;
        display: inline-block;
        line-height: 0.44rem;
        margin-left: 0;
        &:last-child {
          width: 2rem;
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
    .p5 {
      color: #333;
      font-size: 0.24rem;
      line-height: 0.5rem;
      display: flex;
      .pp1 {
        flex: 2;
      }
      .pp2 {
        flex: 3;
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
  .money {
    padding: 0 0.32rem;
    font-size: 0.24rem;
    li {
      line-height: 0.56rem;
      display: flex;
      span {
        flex: 1;
        color: #999999;
        &:last-child {
          text-align: right;
          color: #666666;
        }
      }
    }
  }
  .btn {
    display: flex;
    // height: 2.96rem;
    background-color: #f5f5f5;
    padding: 1rem 0.3rem;
    .btn1 {
      flex: 2;
      padding: 0;
    }
    .btn0 {
      flex: 4;
      padding: 0;
      margin: 0 0.2rem;
    }
    .btn2 {
      flex: 2;
      padding: 0;
      margin: 0 0.2rem;
    }
    .btn3 {
      flex: 1;
      padding: 0;
    }
  }
}
</style>
