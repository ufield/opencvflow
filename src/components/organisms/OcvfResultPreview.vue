<template>
  <div class="result-preview">
    <!--display area.-->
    <a id="download" style="display:none"></a>
    <div class="title">
      Result Preview
    </div>
    <div v-for="result in resultList">
      <!--<span>{{getProcessParameters(result.blockId)}}</span>-->
      <OcvfResultImageDescription
        class="description"
        :block-id="result.blockId"
        @download-image="downloadImage"
      />
      <img :src="addSourcePrefix(result.base64)" />
    </div>
  </div>
</template>

<script>
  import OcvfResultImageDescription from '../molecules/OcvfResultImageDescription'
  // import {processDefinitions} from '../../configs/processDefinitions'

  export default {
    name: "OcvfResultPreview",
    components: {OcvfResultImageDescription},
    computed: {
      resultList: function () {
        return this.$store.state.pipelineResultList
      }
    },

    methods: {
      addSourcePrefix: function(base64){
        let ext = this.$store.state.targetImageExt
        if(ext === 'jpg' || ext === 'jpeg'){
          return 'data:image/jpeg;base64,' + base64
        } else{
          return 'data:image/' + ext +';base64,' + base64
        }
      },

      downloadImage: function(ev, filename){
        // console.log('downloadImage in RP')
        // console.log(filename)
        // console.log(ev)

        filename += '.' + this.$store.state.targetImageExt

        let img = ev.currentTarget.parentElement.nextElementSibling

        let image_data = atob(img.src.split(',')[1])
        // Use typed arrays to convert the binary data to a Blob
        let arraybuffer = new ArrayBuffer(image_data.length)
        let view = new Uint8Array(arraybuffer)
        let blob;
        for (let i=0; i<image_data.length; i++) {
          view[i] = image_data.charCodeAt(i) & 0xff
        }
        try {
          // This is the recommended method:
          blob = new Blob([arraybuffer], {type: 'application/octet-stream'})
        } catch (e) {
          // The BlobBuilder API has been deprecated in favour of Blob, but older
          // browsers don't know about the Blob constructor
          // IE10 also supports BlobBuilder, but since the `Blob` constructor
          //  also works, there's no need to add `MSBlobBuilder`.
          let bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder)
          bb.append(arraybuffer)
          blob = bb.getBlob('application/octet-stream') // <-- Here's the Blob
        }

        // Use the URL object to create a temporary URL
        var url = (window.webkitURL || window.URL).createObjectURL(blob)

        let a = document.getElementById('download')

        a.href = url
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(url)

      },

      // getProcessParameters: function(blockId){
      //   let block = this.$store.getters.getBlock(blockId)
      //   let processId = block.processId
      //
      //   let processName = processDefinitions.find(process => process.processId === processId).name
      //   let parameters  = block.parameters
      //
      //   let detailProcess = parameters.detailProcess
      //   if(detailProcess){
      //     return processName + ' - ' + detailProcess
      //   } else{
      //     return processName
      //   }
      // }

    }
  }
</script>

<style scoped>
  .title{
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    background-color: #f5f5f4;
  }

  .description{
    /*width: 90%;*/
    /*margin-left: 5%;*/
    /*margin-top: 15px;*/
  }

  img {
    width: 90%;
    margin-left: 5%;
    margin-top: 5px;
    margin-bottom: 15px;
  }

  .result-preview{
    /*background-color: #f5f5f4;*/
  }

</style>
