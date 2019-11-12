<template>
  <path :d="d" :x="x" :y="y" stroke="#848484" stroke-width="3px" fill="transparent" @pointerdown="addPoint"/>
</template>

<script>
  import closestPoint from '../../common/line'

  export default {
    name: "OcvfRightSideBar",

    props: {
      x: {
        type: Number,
        default: 0
      },
      y: {
        type: Number,
        default: 0
      },
    },

    computed: {
      d: function(){
        let xi = this.x + 50 + 3
        let xo = this.x + 50 + 8
        let ys = this.y
        let yp = this.y + 5
        let ym = this.y + 25
        let yq = this.y + 45
        let ye = this.y + 50

        return `M ${xi} ${ys} C ${xo} ${yp}, ${xo} ${ys}, ${xo} ${ym}, S ${xo} ${yq}, ${xi} ${ye}`
      }
    },

    methods: {
      addPoint: function(ev) {
        const point = {}
        let cp = closestPoint(ev.currentTarget, [ev.offsetX, ev.offsetY]);

        point.x = cp[0]
        point.y = cp[1]
        point.on = ev.currentTarget
        point.pointType = 'rightBarPoint'

        this.$emit('addPointRight', ev, point)
      }

    }

  }
</script>

<style scoped>
  path{
    cursor: pointer;
  }
</style>
