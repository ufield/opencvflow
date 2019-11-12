<template>
  <div class="window">
    <div class="window-content">
      <OcvfProcessSelector
          :process-definitions="processDefinitions"
          @addBlock="addBlock"
      />
      <div id="main" class="pane">
        <OcvfCanvas
            id="canvas"
            @execPipeline="execPipeline"
        />
        <OcvfResultPreview
            id="preview"
        />
      </div>

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {ipcRenderer} from 'electron'
  import OcvfProcessSelector from "../organisms/OcvfProcessSelector"
  import OcvfCanvas from "../organisms/OcvfCanvas"
  import OcvfResultPreview from "../organisms/OcvfResultPreview"
  import {processDefinitions} from "../../configs/processDefinitions"
  import settingDefinitions from "../../configs/settingDefinitions"

  let extReg=/(.*)(?:\.([^.]+$))/;
  let vm;

  ipcRenderer.on('reply', function(ev, result){
    // console.log(result)
    // let res = result[0]
    let res = result
    if(res.header.code !== '000'){
      alert('Error Occurred on backend process.\n\n' + res.errorMessage)
      return
    }

    vm.$store.commit('setPipelineResult', res.resultList)
  })

  export default {
    name: "SvgPage",

    components: {
      OcvfProcessSelector,
      OcvfCanvas,
      OcvfResultPreview
    },

    data: function () {
      return {
        processDefinitions: processDefinitions,
      }
    },

    methods: {
      addBlock: function (processId) {
        const process = this.processDefinitions.find(process => process.processId === processId)
        const nextLabelId = this.$store.getters.getNextBlockId
        const block = {
          blockId: nextLabelId,
          iconLabel: process.icon,
          x: 100,
          y: 100,
          execButton: false,
          processId: processId,
          linksToNextBlock: [],
          parameters: this.getDefaultParameters(processId)
        }
        this.$store.commit('addBlock', block)

      },

      getDefaultParameters: function (processId) {
        if (processId === 0) {
          // console.log(settingDefinitions.Input)
          // settingDefinitionsからの参照を切って初期化しないと勝手に書き換えられる可能性あり
          return Vue.util.extend({}, settingDefinitions.Input)

        } else {
          let processName = processDefinitions.find(process => process.processId === processId).name
          let settingParameters = Vue.util.extend({}, settingDefinitions[processName])
          let detailProcess = Object.keys(settingParameters)[0] // Binarization なら Binary

          let detailParameters = {}
          for (let i in settingParameters[detailProcess]) {
            let paramName = settingParameters[detailProcess][i]['paramName']
            let paramDefault = settingParameters[detailProcess][i]['paramDefault']
            // let tmp = {}
            // tmp[paramName] = paramDefault
            // let tmp = {
            //   settingParameters[detailProcess][i]['paramName']: settingParameters[detailProcess][i]['paramDefault']
            // }
            // paramName: settingParameters[detailProcess][i]['paramName'],
            //   paramDefault: settingParameters[detailProcess][i]['paramDefault']
            detailParameters[paramName] = paramDefault
            // detailParameters.push(tmp)
          }

          return {
            detailProcess: detailProcess,
            detailParameters: detailParameters
          }

        }

      },

      execPipeline: function (blockId) {
        vm = this
        let pipeline = this.$store.getters.getPipeline(blockId)

        // console.log(pipeline)
        // console.log(JSON.stringify(pipeline))

        if(pipeline.imageFilePath === ''){
          alert('Input image file from "File Input Block".')
          return
        }

        let ext = pipeline.imageFilePath.match(extReg)[2]
        this.$store.commit('setTargetImageExt', ext)
        // console.log(Vue.util.extend({}, pipeline))
        this.$store.commit('setExecutedPipeline', Vue.util.extend([], pipeline.pipeline))
        ipcRenderer.send('message', {str: JSON.stringify(pipeline), obj: pipeline})
      }

    }
  }
  // }



</script>

<style scoped>
  #process-selector {
    /*width: 200px;*/
    /*border: solid #444444;*/
    /*border-width: 0px 1px 0em 0px;*/
    height: 100%;
  }

  #canvas{
    width: 800px;
    height: 100%;
  }

  #preview{
    width: 400px;
    height: 100%;
    border: solid #dddddd;
    border-width: 0px 0px 0px 1px;
  }

  #main {
    display: flex;
  }

</style>
