<template>
  <div id="index" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <div class="slider">
      <div class="slider_item" :style="{ marginLeft: sliberLift + 'rem' }">
        <div class="content">
          <p>进销存</p>
          <span>0.00</span>
        </div>
        <div class="icon_box">
          <div class="item">
            <router-link :to="{ name: 'query' }">
              <img style="width:33px" src="../assets/img/库存查询.png" alt />
              <p>库存明细</p>
            </router-link>
          </div>
          <div class="item">
            <router-link :to="{ name: 'inventory' }">
              <img style="width:33px" src="../assets/img/库存汇总.png" alt />
              <p>库存汇总</p>
            </router-link>
          </div>
          <div class="item">
            <router-link :to="{ name: 'rold' }">
              <img style="width:38.5px" src="../assets/img/在途查询_1.png" alt />
              <p>在途查询</p>
            </router-link>
          </div>
          <div class="item">
            <router-link :to="{ name: 'customer' }">
              <img style="width:30px" src="../assets/img/客户管理_1.png" alt />
              <p>客户管理</p>
            </router-link>
          </div>
          <div class="item">
            <router-link :to="{ name: 'newsale' }">
              <img style="width:35px" src="../assets/img/销售开单_1.png" alt />
              <p>销售开单</p>
            </router-link>
          </div>
          <div class="item">
            <router-link :to="{ name: 'salelistById',params:{id:id} }">
              <img style="width:28px" src="../assets/img/我的销售.png" alt />
              <p>我的销售</p>
            </router-link>
          </div>
          <div class="item" v-if="this.GLOBAL.role?this.GLOBAL.role.erp_allsale_look:false">
            <router-link :to="{ name: 'salelist' }">
              <img style="width:28px" src="../assets/img/销售列表_1.png" alt />
              <p>销售列表</p>
            </router-link>
          </div>
        </div>
      </div>
      <!-- 暂不开放 -->
      <div class="slider_item" :style="{ marginLeft: sliberLift + 6.8 + 'rem' }">
        <div class="content">
          <p>财务</p>
          <span>0.00</span>
        </div>
        <div class="icon_box"></div>
      </div>
      <div class="slider_item" :style="{ marginLeft: sliberLift + 13.6 + 'rem' }">
        <div class="content">
          <p>仓库</p>
          <span>0.00</span>
        </div>
        <div class="icon_box"></div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      id: JSON.parse(sessionStorage.getItem('youmuUser')).id,
      sliberLift: 0,
      Einfo: 0,
      startX: null,
      disX: 0
    }
  },
  methods: {
    //检测左右滑动
    touchStart(e) {
      e = e || event
      if (e.touches.length === 1) {
        this.startX = e.touches[0].clientX // 记录开始位置
        this.disX = 0
      }
    },
    touchMove(e) {
      e = e || event
      e.preventDefault()
      if (e.touches.length === 1) {
        this.disX = e.touches[0].clientX - this.startX
      }
    },
    touchEnd(e) {
      e = e || event
      this.Einfo = this.disX
      this.move(this.disX)
    },
    //左右切换
    move(data) {
      if (data > -100 && data < 100) return
      if (data > 0) {
        this.sliberLift += 6.8
        this.sliberLift = this.sliberLift >= 0 ? 0 : this.sliberLift
      } else {
        this.sliberLift -= 6.8
        this.sliberLift = this.sliberLift <= -13.6 ? -13.6 : this.sliberLift
      }
    }
  },
  created() {
    if (!this.GLOBAL.token) {
      window.location.reload()
    }
  }
}
</script>

<style scoped lang="scss">
#index {
  padding: 0 0.5rem;
  height: 100%;
  overflow: hidden;
  .slider {
    position: relative;
    height: 10rem;
    margin-top: 0.3rem;
    .slider_item {
      position: absolute;
      width: 100%;
      top: 0;
      transition: 0.3s;
      h3 {
        width: 100%;
        height: 0.88rem;
        background: rgba(255, 255, 255, 1);
        text-align: center;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      .content {
        height: 3rem;
        background: -webkit-linear-gradient(left, #5d9ff3 0%, #3482ee 100%);
        background: linear-gradient(left, #5d9ff3 0%, #3482ee 100%);
        border-radius: 0.3rem;
        overflow: hidden;
        text-align: center;
        color: #ffffff;
        p {
          font-size: 0.28rem;
          margin-top: 0.8rem;
          margin-bottom: 0.4rem;
        }
        span {
          font-size: 0.44rem;
          font-weight: 600;
        }
      }
      .icon_box {
        .item {
          float: left;
          width: 33.33%;
          height: 1.3rem;
          text-align: center;
          position: relative;
          margin-top: 0.76rem;
          p {
            position: absolute;
            bottom: 0;
            left: 0.48rem;
          }
        }
      }
    }
  }
}
</style>
