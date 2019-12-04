<template>
  <div id="info">
    <div class="info_card mainBtn">
      <p class="p1">
        <i class="iconfont icondizhi"></i>
        {{ data[0].name }}
      </p>
      <p class="p2">
        <span>{{ data[0].树种 }}</span>,
        <span>{{ data[0].品类 }}</span>,
        <span>{{ data[0].等级 }}</span>
      </p>
      <div class="p3">
        <span class="textover">
          规格：{{ data[0].厚度 }}*{{ data[0].宽度 }}*{{
          data[0].长度 * 1000
          }}
        </span>
        <span class="textover">{{ data[0].片数 }}支/{{ data[0].amount }}m³</span>
      </div>
      <p class="p4">
        <span>数量：{{ data.length }}/</span>
        {{ data.length }}件
      </p>
    </div>
    <div class="info_list">
      <load ref="load" :callback="getData">
        <ul slot="slot_list" class="box">
          <li v-for="(k, i) in data" :key="k.packageNo">
            <span class="num">{{ i + 1 }}</span>
            <p class="no">包号：{{ k.packageNo }}</p>
            <p class="dp">
              <span>RF：{{ timeLength(k.storeInTime) }}天</span>
              <span>TC：￥{{ k.buyPrice }}</span>
            </p>
          </li>
        </ul>
      </load>
    </div>
  </div>
</template>

<script>
import load from '../../../components/loading'
export default {
  name: 'queryInfo',
  components: {
    load
  },
  data() {
    return {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      pageNum: 10,
      id: this.$route.query.id,
      warestoreId: this.$route.query.warestoreId
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await this.$axios.get(
        'http://192.168.0.199:8066/storePackage/showStoreQueryPackage',
        {
          params: {
            tenantId: this.GLOBAL.token.tenantId,
            goodsId: this.id,
            warestoreId: this.warestoreId
          }
        }
      )
      this.data = res.data.data
      console.log(this.data)
      this.data.forEach(item => {
        let arr = item.attributeValue.split(',')
        arr.forEach(i => {
          if (i !== '') {
            item[i.split(':')[0]] = i.split(':')[1]
          }
        })
      })
    }
  },
  computed: {
    timeLength() {
      return val => {
        var Time = new Date().getTime() - parseInt(new Date(val).getTime())
        let timeDay = parseInt(Time / 1000 / 60 / 60 / 24)
        return timeDay ? timeDay : ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
#info {
  height: 100%;
  padding: 0.2rem 0.3rem;
  box-sizing: border-box;
  .info_card {
    height: 2.4rem;
    border-radius: 0.3rem;
    padding: 0.4rem;
    box-sizing: border-box;
    p.p1 {
      font-size: 0.24rem;
      line-height: 0.3rem;
      i {
        font-size: 0.28rem;
        margin-right: 0.1rem;
      }
    }
    p.p2 {
      font-size: 0.3rem;
      line-height: 0.6rem;
    }
    div.p3 {
      font-size: 12px;
      line-height: 0.5rem;
      span {
        width: 45%;
        margin-right: 5%;
        display: inline-block;
        line-height: 0.4rem;
      }
    }
    p.p4 {
      font-size: 12px;
    }
  }
  .info_list {
    height: calc(100% - 2.6rem);
    margin-top: 0.18rem;
    ul.box {
      li {
        height: 1.2rem;
        border-bottom: 1px solid #e5e5e5;
        padding-left: 0.6rem;
        position: relative;
        span.num {
          background: rgba(245, 245, 245, 1);
          border-radius: 50%;
          position: absolute;
          left: 0;
          top: 0.4rem;
          text-align: center;
          display: inline-block;
          width: 0.4rem;
          line-height: 0.4rem;
          font-size: 0.2rem;
        }
        .no {
          color: #2789ed;
          font-size: 0.3rem;
          line-height: 0.5rem;
          padding-top: 0.2rem;
        }
        .dp {
          font-size: 0.2rem;
          line-height: 0.4rem;
          color: #999999;
          span {
            display: inline-block;
            width: 25%;
            margin-right: 3%;
          }
        }
      }
    }
  }
}
</style>
