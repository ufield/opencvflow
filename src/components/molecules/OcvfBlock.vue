<template>

  <g :block-id="blockId" :x="x" :y="y" :process-id="processId">
    <ocvf-exec-button
        v-if="execButton"
        :exec-button="execButton"
        :x="x"
        :y="y"
        :block-id="blockId"
        @execPipeline="execPipeline"
    />
    <ocvf-left-side-bar
        v-if="displayLSB"
        :x="x"
        :y="y"
        @addPointLeft="addPoint"
    />
    <ocvf-tile
        :block-id="blockId"
        :icon-label="iconLabel"
        :x="x"
        :y="y"
        @handleRightClick="handleRightClick"
        @blockSelected="startDrag"
        @handleDoubleClick="handleDoubleClick"
    />
    <ocvf-right-side-bar
        :x="x"
        :y="y"
        @addPointRight="addPoint"
    />
    <text :x="labelX" :y="labelY" fill="#848484" style="inline-size: 100px; text-anchor: middle">
      {{label}}
    </text>
  </g>
</template>

<script>
  import {processDefinitions} from "../../configs/processDefinitions"
  import OcvfTile from "../atoms/OcvfTile"
  import OcvfRightSideBar from "../atoms/OcvfRightSideBar"
  import OcvfLeftSideBar from "../atoms/OcvfLeftSideBar"
  import OcvfExecButton from "../atoms/OcvfExecButton"

  export default {
    name: "OcvfBlock",
    components: {OcvfTile, OcvfRightSideBar, OcvfLeftSideBar, OcvfExecButton},

    props: {
      blockId: {
        type: Number,
        default: 0
      },
      iconLabel: {
        type: String,
        default: ''
      },
      x: {
        type: Number,
        default: 50
      },
      y: {
        type: Number,
        default: 50
      },
      execButton: {
        type: Boolean,
        default: false
      },
      processId: {
        type: Number
      }
    },

    computed: {
      displayLSB: function(){
        return this.processId !== 0 // prcessId = 1, すなわち入力のときは leftSideBar は表示しない
      },
      label: function(){
        let process = processDefinitions.find(process => process.processId === this.processId)
        return process.label
      },
      labelX: function(){
        return this.x + 24
      },
      labelY: function(){
        return this.y + 67
      }
    },

    methods: {
      startDrag: function (ev, blockId, blockX, blockY) {
        this.$emit("blockSelected", ev, blockId, blockX, blockY);
      },

      addPoint: function(ev, points){
        points.blockId = this.blockId
        this.$emit("addLink", ev, points);
      },

      handleRightClick: function(ev, blockId){
        this.$emit("removeBlock", ev, blockId)
      },

      handleDoubleClick: function(){
        if(this.processId === 0) {
          this.$emit('displayFileInput', this.blockId)
        } else {
          this.$emit('displayParameterSetting', this.blockId, this.processId)
        }
      },

      execPipeline: function(){
        this.$emit('execPipeline', this.blockId)
      }

    }

  }


</script>

<style scoped>
  text{
    font-size: 13px;
    font-weight: bold;
  }

</style>
