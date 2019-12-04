<template>
  <div id="saleM">
    <div class="content">
      <load ref="load">
        <ul slot="slot_list">
          <li class="content_li" v-for="i in keys" :key="i">
            <div
              style="height: 0.44rem;line-height:0.44rem;background-color: #F5F5F5"
            >
              <p class="date">{{ i }}</p>
            </div>
            <div class="content-it borBom" v-for="v in data[i]" :key="v.id">
              <i class="iconfont iconyou" @click="jump(v)"></i>
              <p>
                <span class="s3">{{ v.orderNumber }}</span>
                <span class="s1">
                  <span class="s2">应收:</span>
                  ¥{{ v.receivableAmount }}
                </span>
              </p>
            </div>
          </li>
        </ul>
      </load>
    </div>
  </div>
</template>

<script>
import load from '../../../components/loading'
export default {
  name: 'saleMoney',
  data() {
    return {
      data: {},
      keys: [],
      id: this.$route.params.id,
      list: [1, 2, 3]
    }
  },
  created() {
    this.getSale()
  },
  components: {
    load
  },
  methods: {
    /**
     * 获取销售单
     * @method getSale
     */
    async getSale() {
      const res = await this.$axios.get(
        'http://192.168.0.199:7077/sell/showSellReceivable/' + this.id
      )
      console.log(res)
      this.list = res.data.data
      let fp = this.list.map(item => item.sellTime.split('T')[0])
      for (let i in fp) {
        if (!this.data[fp[i]]) {
          this.data[fp[i]] = [this.list[i]]
        } else {
          this.data[fp[i]].push(this.list[i])
        }
      }
      this.keys = Object.keys(this.data)
      console.log(this.data)
    },
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
#saleM {
  height: calc(100% - 1.1rem);
  overflow: hidden;
  .content {
    height: 100%;
    ul {
      padding-bottom: 0.8rem;
      .content_li {
        .date {
          font-size: 0.24rem;
          color: #999;
          padding: 0 0.3rem;
        }
        .content-it {
          height: 1rem;
          line-height: 1rem;
          font-size: 0.24rem;
          box-sizing: border-box;
          position: relative;
          i {
            position: absolute;
            right: 0.3rem;
          }
          p {
            text-align: left;
            display: flex;
            span {
              color: #333333;
            }
          }
          .s3 {
            font-size: 0.28rem;
            color: #999;
            flex: 1;
            padding-left: 0.4rem;
            box-sizing: border-box;
          }
          .s2 {
            font-size: 0.28rem;
          }
          .s1 {
            flex: 1;
            color: #ed273a;
            font-size: 0.28rem;
            padding-right: 0.7rem;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
