<template>
  <dialog
      :process-name="processName"
      :block-id="blockId"
  >
    <form method="dialog">
      <header class="toolbar toolbar-header">
        <h1 class="title">Parameter Settings</h1>
      </header>

      <div id="detail-process-select">
        <div>
          <span>select process of {{processName}}</span>
          <select class="form-control" v-model="nowDetailProcess">
            <option v-for="dp in detailProcesses">
              {{dp}}
            </option>
          </select>
        </div>
        <div id="detail-parameters-setting">
          <div class="detail-parameter" v-for="sp in settingParameters">
            <span>set {{sp.paramName}} {{sp.description}}</span><br>
            <input
                class="form-control"
                type="number"
                :data-paramname="sp.paramName"
                :step="sp.step"
                :value="getParamValue(sp.paramName)"
                @change="changeParameter"
            />
<!--/            :value="sp.paramDefault"-->
          </div>
        </div>

      </div>

      <footer class="toolbar toolbar-footer">
        <span class="btn btn-default reset-btn" @click="resetParameters">Reset</span>
        <button class="btn btn-primary pull-right complete-btn" @click="setParametersComplete">OK</button>
      </footer>
    </form>
  </dialog>

</template>

<script>
  import Vue from 'vue'
  import settingDefinitions from "../../configs/settingDefinitions"

  export default {
    name: "OcvfParameterSettingDialog",

    data: function(){
      return {
        nowDetailProcess: '',
        detailParametersCache: {}
      }
    },

    props: {
      processName:{
        type: String,
        default: ''
      },
      blockId: {
        type: Number
      }
    },

    computed: {
      detailProcesses: function(){
      //   let processName = processDefinitions.find(process => process.processId === this.processId).name

        // TODO: O.K.後に保持しているものがあればそれを使うようにする
        let block = this.$store.getters.getBlock(this.blockId)

        if(!block){
          return
        }

        this.nowDetailProcess = block.parameters.detailProcess
        return Object.keys(settingDefinitions[this.processName])
      },

      settingParameters: function(){
        let copiedSettingParameters = Vue.util.extend({}, settingDefinitions[this.processName][this.nowDetailProcess])

        this.detailParametersCache = {}
        for(let i in copiedSettingParameters){
          let sp = copiedSettingParameters[i]
          this.detailParametersCache[sp.paramName] = sp.paramDefault
        }
        return copiedSettingParameters
      }

    },

    methods: {
      setParametersComplete: function(){
        this.setParameters()
        this.$emit('reconstructPipelines') // 無駄が多いがこれがわかりやすいので採用
      },

      setParameters: function(){
        let parameters = {'detailProcess': this.nowDetailProcess}
        parameters['detailParameters']  = this.detailParametersCache

        let copiedParameters = Vue.util.extend({}, parameters)
        let info = {blockId: this.blockId, parameters: copiedParameters}
        this.$store.commit('setParameters', info)
      },


      getParamValue: function(paramName){
        let block = this.$store.getters.getBlock(this.blockId)

        let parameters = settingDefinitions[this.processName][this.nowDetailProcess]
        if(!block || this.nowDetailProcess !== block.parameters.detailProcess){
          let detailParam = parameters.find(param => param.paramName === paramName)
          return detailParam.paramDefault
        } else {
          return block.parameters.detailParameters[paramName]
        }

      },

      resetParameters: function(){
        this.nowDetailProcess = Object.keys(settingDefinitions[this.processName])[0]
        this.detailParametersCache = Vue.util.extend({}, settingDefinitions[this.processName][this.nowDetailProcess])
        // this.nowDetailProcess = Object.keys(settingDefinitions[this.processName])[0]
        // return Object.keys(settingDefinitions[this.processName])
        //
        // let copiedFileParameters = Vue.util.extend({}, this.fileParameters)
        // let info = {blockId: this.blockId, parameters: copiedFileParameters}
        // this.$store.commit('setParameters', info)
      },

      changeParameter: function(ev){
        let paramName = ev.currentTarget.dataset['paramname']
        let value = Number(ev.currentTarget.value) // TODO: Number以外
        this.detailParametersCache[paramName] = value
      }

    },

  }
</script>

<style scoped>

  #detail-process-select{
    width: 90%;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 5%;
    margin-right: 5%;
  }

  #detail-parameters-setting{
    margin-top: 10px;
  }

  .detail-parameter{
    margint-top: 10px;
  }

  select{
    /*width: 10%;*/
    margin: auto;
  }

  dialog {
    text-align: left;
    width: 250px;
    /*height: 100%;*/
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translate(-50%, 0);
    border: solid 1px #aaa;
    border-radius: 5px;
    box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.3);
  }

  .reset-btn{
    margin: 5px;
  }

  .complete-btn{
    margin: 5px;
  }
</style>
