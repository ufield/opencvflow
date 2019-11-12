import Vue from 'vue'
import Vuex from 'vuex'

// import { createPersistedState, createSharedMutations } from 'vuex-electron'
//
// import modules from './modules'

Vue.use(Vuex)

let blocks = [
  {
    blockId: 1,
    processId: 0,
    iconLabel: 'In',
    execButton: false,
    x: 20,
    y: 30,
    linksToNextBlock: [],
    parameters: {
      imageFileName: '',
      imageFilePath: '',
      imageData: ''
    }
  },
  // {
  //   blockId: 2,
  //   processId: 1,
  //   iconLabel: 'GS',
  //   execButton: false,
  //   x: 120,
  //   y: 30,
  //   linksToNextBlock: [],
  //   parameters: {}
  //   // linkToPreviousBlock: {} // Link 作成時にこの要素が追加される。 (Input Block以外)
  // },
  // {
  //   blockId: 3,
  //   iconLabel: 'Bi',
  //   processId: 2,
  //   execButton: false,
  //   x: 220,
  //   y: 30,
  //   linksToNextBlock: [],
  //   parameters: {}
  // },
  // {
  //   blockId: 4,
  //   iconLabel: 'Gr',
  //   processId: 4,
  //   execButton: false,
  //   x: 320,
  //   y: 30,
  //   linksToNextBlock: [],
  //   parameters: {}
  // },
]


// ===============
// pipelines の仕様↓ ※ pipelineId は、pipelineの終点のblockIdと一致させる
// [
//   {
//     pipelineId: lastBlockId,
//     imageFilePath: "", // 画像ファイルのURL
//     pipeline:[
//       {
//         processId: processId
//         processDetail: processDetail // 実際に実行されるプロセス名 (二値化なら、Binary or ToZero or Otsuなど)
//         parameters: {...}
//       },
//       {
//         processId: processId
//         processDetail: processDetail //
//         parameters: {...}
//       },
//      ︙
//      ],
//  pipelineId: [...]
//  ︙
// ]
// ===============

function isInputBlock(block){
  return block.processId === 0
}

export default new Vuex.Store({
// export const store = new Vuex.Store({
  state: {
    blocks: blocks,
    pipelines: [],
    links: [],
    nextBlockId: 2,
    nextLinkId: 1,
    targetImageExt: '',
    executedPipeline: {},
    pipelineResultList: []
  },

  mutations: {
    setPipelineResult(state, result){
      state.pipelineResultList = result
    },

    setTargetImageExt(state, ext){
      state.targetImageExt = ext
    },

    setExecutedPipeline(state, pipeline){
      state.executedPipeline = pipeline
    },

    addBlock(state, block){
      state.blocks.push(block)
      // state.blocks[state.nextBlockId] = block // Hash に追加の場合は算術プロパティが発火しない this.$set?
      ++state.nextBlockId
    },

    removeBlock(state, blockId){
      let index = state.blocks.findIndex(block => block.blockId === blockId)
      if(index >= 0) {
        state.blocks.splice(index, 1)
      }
    },

    updateBlockPosition(state, blockInfo){
      let selectedBlock = state.blocks.find(block => block.blockId === blockInfo.blockId)
      selectedBlock.x = blockInfo.x;
      selectedBlock.y = blockInfo.y;
    },

    incrementNextLinkId(state){
      ++state.nextLinkId
    },


    updateLinksToNextBlock(state, info) {
      let selectedBlock = state.blocks.find(block => block.blockId === info.blockId)
      selectedBlock.linksToNextBlock.push({id: info.linkId, pathEdge: info.pathEdge})
    },

    updateLinkToPreviousBlock(state, info) {
      let selectedBlock = state.blocks.find(block => block.blockId === info.blockId)
      selectedBlock.linkToPreviousBlock = {id: info.linkId, pathEdge: info.pathEdge}
    },

    removeLinkToPreviousBlock(state, blockId) {
      let selectedBlock = state.blocks.find(block => block.blockId === blockId)
      delete selectedBlock.linkToPreviousBlock
    },

    removeOneLinkFromLinksToNextBlock(state, info) {
      let selectedBlock = state.blocks.find(block => block.blockId === info.blockId)
      let index = selectedBlock.linksToNextBlock.findIndex(link => link.id === info.linkId)
      if(index >= 0) {
        selectedBlock.linksToNextBlock.splice(index, 1)
      }
    },

    inputFileParameters(state, info){
      let selectedBlock = state.blocks.find(block => block.blockId === info.blockId)
      selectedBlock.parameters = info.parameters
    },

    setParameters(state, info){
      let selectedBlock = state.blocks.find(block => block.blockId === info.blockId)
      selectedBlock.parameters = info.parameters
    },

    reconstructPipelines(state, links) {
      // pipeline初期化
      state.pipelines = []
      for(let i in state.blocks) {
        let block = state.blocks[i]
        block.execButton =false;

        if (isInputBlock(block)) continue

        // pipelineの器作成
        let pipelineInfo = {pipelineId: block.blockId, pipeline: [], imageFilePath: ''}

        let process = {
          blockId: block.blockId,
          processId: block.processId,
          parameters: block.parameters
        }
        pipelineInfo.pipeline.push(process)

        let pipelineComplete = false
        // 1つのBlockIdからpreviousBlockにたどっていく
        while (block.linkToPreviousBlock) {

          let linkId          = block.linkToPreviousBlock.id
          let selectedLink    = links.find(link => link.id === linkId)
          let previousBlockId = selectedLink.rightBarPoint.blockId

          block = state.blocks.find(block => block.blockId === previousBlockId)

          // たどっていった先にInputがあればpipeline完成
          if (isInputBlock(block)){
            pipelineComplete = true
            pipelineInfo.imageFilePath = block.parameters.imageFilePath
            break
          }

          let process = {
            blockId: block.blockId,
            processId: block.processId,
            parameters: block.parameters
          }

          pipelineInfo.pipeline.push(process)
        }

        if(pipelineComplete){
          pipelineInfo.pipeline = pipelineInfo.pipeline.reverse() // 逆から順にpipelineを作成したので通常の順に戻す
          state.pipelines.push(pipelineInfo)
          state.blocks[i].execButton = true
        }

      }
    },


  },

  getters: {
    getNextBlockId(state) {
      return state.nextBlockId
    },

    getNextLinkId(state){
      return state.nextLinkId
    },

    getBlock: function(state) {
      return function(blockId) {
        return state.blocks.find(block => block.blockId === blockId)
      }
    },

    getPipeline: function(state) {
      return function(pipelineId){
        return state.pipelines.find(pipeline => pipeline.pipelineId === pipelineId)
      }
    }
  },

  // modules,
  // plugins: [
  //   createPersistedState(),
  //   createSharedMutations()
  // ],
  strict: process.env.NODE_ENV !== 'production'
})
