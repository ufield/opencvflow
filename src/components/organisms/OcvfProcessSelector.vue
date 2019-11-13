<template>
  <div class="pane-sm sidebar">
    <nav class="nav-group">
      <h5 class="nav-group-title">Select Process</h5>

      <OcvfProcessListItem
          v-for="process in processDefinitions"
          :label="process.label"
          :process-id="process.processId"
          @addBlock="addBlock"
      />

    </nav>
  </div>

</template>

<script>
  import OcvfProcessListItem from "../molecules/OcvfProcessListItem"

  export default {
    name: "OcvfProcessSelector",

    components :{
      OcvfProcessListItem
    },

    props:{
      processDefinitions: {
        type: Array
      },
    },

    methods: {
      addBlock: function(processId){
        this.$emit('addBlock', processId)
      }
    }

  }
</script>

<style scoped>
  .sidebar{
    text-align: left;
  }

</style>
