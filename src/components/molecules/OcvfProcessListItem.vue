<template>
  <a class="nav-group-item" :process-id="processId" :label="label" @click="handleClick">
    <span :class="classes"></span>
    {{label}}
  </a>
</template>

<script>
  export default {
    name: "OcvfProcessListItem",

    props: {
      label: {
        type: String
      },
      processId: {
        type: Number
      }
    },

    computed: {
      classes: function(){
        let iconType = this.processId === 0 ? 'icon-upload' : 'icon-picture';
        return `icon ${iconType}`
      }
    },

    methods: {
      handleClick: function(){
        this.$emit('addBlock', this.processId)
      }
    }
  }
</script>

<style scoped>
</style>
