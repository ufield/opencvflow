<template>
  <g>
    <path :d="d" :x="x" :y="y" :dragging="dragging" stroke="#848484" stroke-width="3" fill="transparent" @pointerdown="addPoint"/>
  </g>
</template>

<script>

  import closestPoint from '../../common/line'

  export default {
    name: "OcvfLeftSideBar",

    props: {
      x: {
        type: Number,
        default: 0
      },
      y: {
        type: Number,
        default: 0
      },
      dragging: {
        type: String,
        default: "none"
      }
    },

    computed: {
      d: function(){
        let xi = this.x - 3
        let xo = this.x - 8
        let ys = this.y
        let yp = this.y + 5
        let ym = this.y + 25
        let yq = this.y + 45
        let ye = this.y + 50

        return `M ${xi} ${ys} C ${xo} ${yp}, ${xo} ${ys}, ${xo} ${ym}, S ${xo} ${yq}, ${xi} ${ye}`
      },

    },

    methods: {
      addPoint: function(ev) {
        const point = {}
        let cp = closestPoint(ev.currentTarget, [ev.offsetX, ev.offsetY]);
        point.x = cp[0]
        point.y = cp[1]
        point.on = ev.currentTarget
        point.pointType = 'leftBarPoint'

        this.$emit('addPointLeft', ev, point)
      }

    }

  }
</script>

<style scoped>
  path{
    cursor: pointer;
  }
</style>
