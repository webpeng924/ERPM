<template>
  <div id="step">
    <div
      class="step_item"
      :style="{width:sw}"
      :class="{wait:steps[k-1]==step}"
      v-for="k in steps.length"
      :key="k"
    >
      <div class="line" v-if="k!=1"></div>
      <!-- <i class="iconfont iconqueren"></i> -->
      <i class="iconfont iconxuanzhong4"></i>
      <p>{{steps[k-1].txt}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "step",
  props: ['steps', 'step'],
  computed: {
    sw: function () {
      return 1 / this.steps.length * 100 + '%'
    }
  }
}
</script>

<style scoped lang="scss">
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
  .wait {
    color: #2789ed;
  }
}
</style>
