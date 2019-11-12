<template>
  <div>
    <div class="process-label" @click="onClickProcessLabel">
      <span class="icon icon-download"></span>
      <span style="margin-left: 5px">{{processLabel}}</span>
    </div>
    <div v-for="(value, key) in detailParameters" class="parameter-label">
      {{key}}: {{value}}
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {processDefinitions} from '../../configs/processDefinitions'

  export default {
    name: "OcvfResultImageDescription",

    data: function(){
      return {
        // processLabel: '',
        // detailParameters: {}
        previousBlockId: 0
      }
    },

    props:{
      blockId: {
        type: Number
      }
    },

    computed: {
      processLabel: function(){
        // let block = this.$store.getters.getBlock(this.blockId)
        // if(!block) return
        try {
          let pipeline = this.$store.state.executedPipeline
          let info = pipeline.find(process => process.blockId === this.blockId)
          // console.log('----------- processLabel ----------')
          // console.log(this.blockId)
          // console.log(pipeline)
          // console.log(info)

          let processId = info.processId

          let processName = processDefinitions.find(process => process.processId === processId).name

          let parameters = info.parameters
          let detailProcess = parameters.detailProcess
          if (detailProcess) {
            return processName + ' - ' + detailProcess
          } else {
            return processName
          }
        } catch (e) {
          // block を1つ削除して、別のblockを付け加えてpipeline実行したとき、
          // blockId が executedPipelineより先に更新される。
          // このとき、pipeline.find で見つからずエラーとなるので、対処している
          // console.log('Error in processLabel')
          // console.log(e)
          return
        }

      },

      detailParameters: function () {
        try {
          let pipeline = this.$store.state.executedPipeline
          let info = pipeline.find(process => process.blockId === this.blockId)

          let parameters  = info.parameters
          return parameters.detailParameters
        } catch (e) {
          // block を1つ削除して、別のblockを付け加えてpipeline実行したとき、
          // blockId が executedPipelineより先に更新される。
          // このとき、pipeline.find で見つからずエラーとなるので、対処している
          // console.log('Error in processLabel')
          // console.log(e)
          return
        }
      },

    },

    methods:{
      onClickProcessLabel: function(ev){
        let block = this.$store.getters.getBlock(this.blockId)
        let processId = block.processId
        let processName = processDefinitions.find(process => process.processId === processId).name
        let parameters  = block.parameters
        let detailProcess    = parameters.detailProcess
        let detailParameters = parameters.detailParameters

        let filename = processName
        if(!!detailProcess){
          filename += '@' + detailProcess
        }
        for(let key in detailParameters){
          filename += '_' + key + '@' + detailParameters[key]
        }

        this.$emit('download-image', ev, filename)
      },

    },

  }
</script>

<style scoped>
  .process-label{
    background-color: #FCFDD4;
    border: solid #dddddd;
    border-width: 1px 0px 1px 0px;
  }

  .process-label:active{
    background-color: #F3F5A9;
  }

  .process-label .icon{
    margin-left: 5%;
  }

  .process-label span{
    font-weight: bold;
    font-size: 15px;
  }

  .parameter-label{
    width: 90%;
    margin-left: 5%;
    font-weight: bold;
  }

  hr{
    margin-top: 0px;
    margin-bottom: 0px;
  }

</style>
