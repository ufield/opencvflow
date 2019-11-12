<template>
  <path
      class="path"
      :path-start="pathStart"
      :path-end="pathEnd"
      :d="d"
      fill="transparent"
      stroke-width="2"
      stroke="#585858"
      @click.right="handleRightClick"
  />
  <!--:if="display"-->
</template>

<script>
  export default {
    name: "OcvfPath",

    props: {
      // display: {
      //   type: Boolean,
      //   default: false
      // },
      pathStart:{
        type: Object
      },
      pathEnd: {
        type: Object
      }
    },

    computed: {
      d: function() {
        let x1 = this.pathStart.x
        let y1 = this.pathStart.y
        let x2 = this.pathEnd.x
        let y2 = this.pathEnd.y
        let xp = (x2 - x1) * 0.8 + x1
        let xq = (x2 - x1) * 0.2 + x1

        return `M ${x1} ${y1} C ${xp} ${y1}, ${xq} ${y2}, ${x2} ${y2}`
      }
    },

    methods: {
      handleRightClick: function(ev) {
        this.$emit('handleRightClick', ev)
      }

    }

  }
</script>

<style scoped>
  path{
    cursor: pointer;
  }

</style>
