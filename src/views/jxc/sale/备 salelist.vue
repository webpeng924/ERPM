<template>
  <div id="salelist">
    <div class="search">
      <div class="search_warp">
        <i class="iconfont iconsousuo"></i>
        <input type="text" placeholder="品名\品牌\包号" />
      </div>
      <div class="right">
        <span @click="visible.state=true">
          筛选
          <i class="iconfont icon-pingbi2"></i>
        </span>
      </div>
    </div>
    <div class="main">
      <!-- 筛选框 -->
      <div class="title borBom">
        <transition name="state">
          <div class="state_main" v-if="visible.state" @click.self="visible.state=false">
            <div class="sc">
              <div class="cl">
                <div class="item">审核状态</div>
                <div class="item active">审核状态</div>
                <div class="item">审核状态</div>
                <div class="item">审核状态</div>
                <div class="item">审核状态</div>
                <div class="item">审核状态</div>
              </div>
              <div class="cr">
                <div class="item">审核状态</div>
                <div class="item active">
                  审核状态
                  <i class="iconfont icon-pingbi2"></i>
                </div>
                <div class="item">审核状态</div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="content">
        <load ref="load">
          <ul slot="slot_list">
            <li class="content_li">
              <div style="height: 0.44rem;background-color: #F5F5F5">
                <p class="date">2019-04-04</p>
              </div>
              <div class="it borBom">
                <i class="iconfont icon-pingbi2" @click="jump(1)"></i>
                <p style="color: #2789ED">XGF1346746FHDDS</p>
                <p>
                  <span>上海鸿树木业有限公司</span>
                  <span class="s3" style="color: #ED273A">¥58,000.00</span>
                </p>
                <p>
                  <span class="s1">苏AM0K45</span>
                  <span class="s2">6件/ 4.35m³</span>
                </p>
              </div>
              <div class="it">
                <nut-button type="red" shape="circle" small>确认收货</nut-button>
              </div>
            </li>
          </ul>
        </load>
      </div>
      <div>
        <nut-button block @click="$router.push({name:'newsale'})">新增销售开单</nut-button>
      </div>
    </div>
  </div>
</template>

<script>
import load from '../../../components/loading'
export default {
  name: "salelist",
  components: {
    load
  },
  data() {
    return {
      visible: {
        state: false
      }
    }
  },
  methods: {
    //跳转详情
    jump(id) {
      this.$router.push({
        name: 'saleinfo',
        params: { id: id }
      })
    }
  }
}
</script>

<style scoped lang="scss">
#salelist {
  height: 100%;
  .search {
    padding: 0.2rem 0.5rem 0.3rem;
    height: 0.6rem;
  }
  .main {
    height: calc(100% - 1.1rem);
    box-shadow: 0px -2px 6px 0px rgba(51, 51, 51, 0.12);
    overflow: hidden;
    .title {
      padding: 0.3rem;
      color: #cccccc;
      .left {
        float: left;
        width: 60%;
      }
      .right {
        float: right;
        width: 33%;
        span {
          width: 100%;
          vertical-align: middle;
          i {
            vertical-align: middle;
            margin-left: 0.2rem;
            font-size: 0.24rem;
          }
        }
      }
      span {
        display: inline-block;
        width: 50%;
        text-align: center;
        color: #333333;
        font-size: 0.24rem;
      }
      span.active {
        color: #2789ed;
      }
    }
    .content {
      height: calc(100% - 1.7rem);
      ul {
        padding-bottom: 0.4rem;
      }
      .content_li {
        padding-left: 0.3rem;
        padding-right: 0.3rem;
        .date {
          font-size: 0.3rem;
          font-weight: bold;
          padding-top: 0.3rem;
          padding-bottom: 0.1rem;
        }
        .card {
          margin-top: 0.2rem;
          // border-radius: 0.3rem;
          // box-shadow: 0 0px 5px 1px #e5e5e5;
        }
        .it {
          padding: 0.2rem;
          text-align: right;
          position: relative;
          i {
            position: absolute;
            right: 0.2rem;
            top: 0.85rem;
          }
          p {
            text-align: left;
            margin-top: 0.2rem;
            color: #999999;
            font-size: 0.28rem;
            span {
              color: #333333;
            }
          }
          .s1,
          .s2,
          .s3 {
            display: inline-block;
            width: 33%;
          }
          .s3 {
            text-align: right;
            padding-right: 0.4rem;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}
.state_main {
  position: fixed;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  top: 2rem;
  left: 0;
  width: 100%;
  z-index: 1;
  overflow: hidden;
  .sc {
    overflow: hidden;
    background-color: #ffffff;
    .cl {
      width: 30%;
      float: left;
      background-color: #f5f5f5;
      text-align: center;
    }
    .cr {
      width: 70%;
      float: left;
    }
    .item {
      padding: 0 0.3rem;
      height: 0.9rem;
      line-height: 0.9rem;
      font-size: 0.28rem;
      color: #333333;
      i {
        float: right;
      }
    }
    .item.active {
      background-color: #ffffff;
      color: #2789ed;
    }
  }
}
.state-enter,
.state-leave-to {
  opacity: 0;
}
.state-enter-active,
.state-leave-active {
  transition: opacity 0.5s;
}
.state-enter-to,
.state-leave {
  opacity: 1;
}
</style>
