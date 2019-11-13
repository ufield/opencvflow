<template>
  <dialog
    :file-parameters="fileParameters"
    :block-id="blockId"
  >
    <form method="dialog">
      <header class="toolbar toolbar-header">
        <h1 class="title">Input image</h1>
      </header>

      <div id="input-area">
        <label for="select-file">
          <span class="btn btn-default">Select File</span>
          <span style="text-align: center">
            {{fileParameters.imageFileName}}
          </span>
          <input
              type="file"
              id="select-file"
              @click="setFileEvent"
              accept="image/png,image/jpeg,image/bmp"
          >
        </label>
      </div>
      <img :src="fileParameters.imageData" alt="">

      <footer class="toolbar toolbar-footer">
        <span class="btn btn-default reset-btn" @click="resetParameters">Reset</span>
        <button class="btn btn-primary pull-right complete-btn" @click="inputFileComplete">OK</button>
      </footer>
    </form>
  </dialog>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: "OcvfFileInputDialog",

    props: {
      fileParameters:{
        type: Object
      },
      blockId: {
        type: Number
      }
    },

    methods: {
      setFileEvent: function(){
        let _vm = this

        let objFile = document.getElementById("select-file");
        objFile.addEventListener("change", function(ev) {
          try{
            let file = ev.target.files[0];
            let reader = new FileReader();

            _vm.fileParameters.imageFileName = file.name
            _vm.fileParameters.imageFilePath = file.path
            reader.readAsDataURL(file);
            reader.onload = function(e) {
              _vm.fileParameters.imageData = e.target.result
            };
          } catch (e) {
            // console.log('input File Error')
            // console.log(e)
          }
        }, false)
      },


      inputFileComplete: function(){
        this.inputFileParameters()
        this.$emit('reconstructPipelines') // 無駄が多いがこれがわかりやすいので採用
      },

      inputFileParameters: function(){
        let copiedFileParameters = Vue.util.extend({}, this.fileParameters)
        let info = {blockId: this.blockId, parameters: copiedFileParameters}
        this.$store.commit('inputFileParameters', info)
      },

      resetParameters: function(){
        for(let i in this.fileParameters){
          this.fileParameters[i] = ''
        }
        let copiedFileParameters = Vue.util.extend({}, this.fileParameters)
        let info = {blockId: this.blockId, parameters: copiedFileParameters}
        this.$store.commit('inputFileParameters', info)
      }

    },

  }
</script>

<style scoped>
  dialog{
    text-align: left;
  }

  img{
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 350px;
    display: block;
  }

  #select-file{
    display:none
  }

  #input-area{
    margin: 10px;
  }

  dialog {
    width: 400px;
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
