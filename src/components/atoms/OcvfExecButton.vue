<template>
  <g :transform="transform" :x="x" :y="y">
    <path
        class="exec-btn"
        d="M -7 -8 L -7 8 L 7 0 z"
        fill="#2EFE2E"
        stroke-width="2"
        stroke="#A4A4A4"
        @click="handleClick"
    />
  </g>

</template>

<script>
  export default {
    name: "OcvfExecBtutton",

    data: function(){
      return{
        tx: 0,
        ty: 0,
      }
    },

    props: {
      blockId: {
        type: Number,
        default: 0
      },
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
      transform: function() {
        this.tx = this.x + 27
        this.ty = this.y - 14
        return `translate(${this.tx},${this.ty})`
      },
    },

    methods: {
      handleClick: function(){
        this.$emit('execPipeline')
      }
    }
  }
</script>

<style scoped>
  path {
    cursor: pointer;
    text-align: center;
  }

  path:active {
    animation: sizeScale 0.2s ease forwards;
  }

  @keyframes sizeScale{
    100% {
      transform: scale(0.8);
    }
  }
</style>
