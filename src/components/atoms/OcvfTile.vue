<template>
  <g
      :icon-label="iconLabel"
      @pointerdown="startDrag"
      @dblclick="handleDoubleClick"
      @click.right="handleRightClick"
      :block-id="blockId"
      :x="x"
      :y="y"
      class="tile"
  >
    <rect
        :x="x"
        :y="y"
        width="50"
        height="50"
        stroke="#444444"
        stroke-width="4"
        rx="10"
        yr="10"
        fill="#f0f8ff"
    />
    <text :x="textX" :y="textY" style="inline-size: 45px; text-anchor: middle">
      {{iconLabel}}
    </text>
  </g>
</template>

<script>
  export default {
    name: "OcvfTile",

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
        default: 0
      },
      y: {
        type: Number,
        default: 0
      }

    },

    computed: {
      textX: function() {
        return this.x + 24
      },
      textY: function() {
        return this.y + 33
      }
    },

    methods: {
      startDrag(ev) {
        this.$emit("blockSelected", ev, this.blockId, this.x, this.y);
      },
      handleRightClick: function (ev) {
        this.$emit('handleRightClick', ev, this.blockId)
      },
      handleDoubleClick: function() {
        // dblClick イベントは、pointerdown等と併用できない
        this.$emit('handleDoubleClick')
      },

    }
  }

</script>

<style scoped>

  /*
  photon.cssを入れると g でまとめたやつの cursor: pointer が効かなくなった
  */
  rect{
    cursor: pointer;
  }

  text{
    cursor: pointer;
  }

  /*g{*/
    /*cursor: pointer !important;*/
  /*}*/

  text {
    font-family: Times New Roman;
    font-size: 26px;
    font-weight: bold;
    /*text-align: justify;*/
    /*text-align-last: justify;*/
    /*text-align-last:center;*/
  }

</style>
