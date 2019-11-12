<template>
  <g :link-id="linkInfo.id">
    <circle v-if="linkInfo.leftBarPoint.display"  :cx="linkInfo.leftBarPoint.x" :cy="linkInfo.leftBarPoint.y" r="3.5" fill="#585858"></circle>
    <!--<OcvfPath :if="linkInfo.path" :path-start="linkInfo.pathStart" :path-end="linkInfo.pathEnd" @handleRightClick="handleRightClick"></OcvfPath>-->
    <OcvfPath :path-start="linkInfo.pathStart" :path-end="linkInfo.pathEnd" @handleRightClick="handleRightClick"></OcvfPath>
    <circle v-if="linkInfo.rightBarPoint.display" :cx="linkInfo.rightBarPoint.x" :cy="linkInfo.rightBarPoint.y" r="3.5" fill="#585858"></circle>
  </g>

</template>

<script>
  import OcvfPath from '../atoms/OcvfPath'

  export default {
    name: "OcvfLink",

    components: {OcvfPath},

    props: {
      linkInfo: {
        type: Object,
        default: function() {
          return {
            id: 0,
            pointType: "",
            // path: false,
            leftBarPoint: {x: 0, y: 0, on: "", display: false, blockId: 0},
            rightBarPoint: {x: 0, y: 0, on: "", display: false, blockId: 0},
            pathStart: {x: 0, y: 0},
            pathEnd: {x: 0, y: 0},
          }
        }
      },
    },

    methods: {
      handleRightClick: function() {
        this.$emit('removeLink', this.linkInfo.id)
      }
    }

  }
</script>

<style scoped>

</style>
