<template>
  <div>
    <svg @pointermove="onPointerMove" @pointerup="stopDrag" @pointerdown="onPointerDown">
      <OcvfBlock
          v-for="block in blocks"
          :block-id="block.blockId"
          :icon-label="block.iconLabel"
          :x="block.x" :y="block.y"
          :dragging="dragging"
          :exec-button="block.execButton"
          :process-id="block.processId"
          @blockSelected="startDragBlock"
          @addLink="addLink"
          @removeBlock="removeBlock"
          @displayFileInput="displayFileInput"
          @displayParameterSetting="displayParameterSetting"
          @execPipeline="execPipeline"
      />
      <OcvfLink
          v-for="link in links"
          :link-info="link"
          @removeLink="removeLinkWithBlock"
      />

    </svg>
    <OcvfParameterSettingDialog
        id="parameter-setting-dialog"
        :process-name="nowProcessName"
        :block-id="nowProcessBlockId"
        @reconstructPipelines="reconstructPipelines"
    />
    <OcvfFileInputDialog
        id="input-dialog"
        :file-parameters="nowFileParameters"
        :block-id="nowInputFileBlockId"
        @reconstructPipelines="reconstructPipelines"
    />
  </div>
</template>

<script>
  import Vue from 'vue'
  import OcvfBlock from "../molecules/OcvfBlock"
  import OcvfLink from "../molecules/OcvfLink"
  import OcvfFileInputDialog from "./OcvfFileInputDialog"
  import OcvfParameterSettingDialog from "./OcvfParameterSettingDialog"
  import closestPoint from "../../common/line"
  import {processDefinitions} from "../../configs/processDefinitions"
  import settingDefinitions from "../../configs/settingDefinitions"

  export default {
    name: "OcvfCanvas",

    components: {
      OcvfParameterSettingDialog,
      OcvfFileInputDialog,
      OcvfBlock,
      OcvfLink
    },

    data: function () {
      return {
        execButton: false,
        dragging: "none",
        selectedBlockId: 0,
        selectedLinkId: 0,
        selectedPointType: "",
        linkPointType: "",
        links: [],
        dragOffset: {
          x: 0,
          y: 0
        },
        nowFileParameters: Vue.util.extend({}, settingDefinitions.Input),
        nowInputFileBlockId: 0,
        nowProcessParameters: {},
        nowProcessName: 'Binarization',
        nowProcessBlockId: 0
      }
    },


    computed: {
      blocks: function () {
        return this.$store.state.blocks
      },
      selectedLink: function () {
        return this.links.find(link => link.id === this.selectedLinkId)
      }
    },

    methods: {
      removeLink: function (linkId) {
        let index = this.links.findIndex(link => link.id === linkId)
        if (index >= 0) {
          this.links.splice(index, 1)
        }
      },

      removeLinkWithBlock: function (linkId) {
        let link = this.links.find(link => link.id === linkId)
        let leftBarBlockId = link.leftBarPoint.blockId
        let rightBarBlockId = link.rightBarPoint.blockId

        this.$store.commit('removeLinkToPreviousBlock', leftBarBlockId)
        this.$store.commit('removeOneLinkFromLinksToNextBlock', {blockId: rightBarBlockId, linkId: linkId})

        this.removeLink(linkId)
        this.$store.commit('reconstructPipelines', this.links)
      },

      doublePointsOnLeftSideBar: function () {
        let leftBarBlockId = this.selectedLink.leftBarPoint.blockId;
        let linksOnLeftSidebar = this.links.filter((link) => {
          return link.leftBarPoint.blockId === leftBarBlockId
        })
        return linksOnLeftSidebar.length > 1

      },

      removeBlock: function (ev, blockId) {
        // blockに紐づくLinkを消去
        try {
          let block = this.$store.getters.getBlock(this.selectedBlockId)

          for (let i in block.linksToNextBlock) {
            let linkInfo = block.linksToNextBlock[i]
            this.selectedLinkId = linkInfo.id

            // blockの反対側のLink情報を消す
            let leftBarBlockId = this.selectedLink.leftBarPoint.blockId
            this.$store.commit('removeLinkToPreviousBlock', leftBarBlockId)
            this.removeLink(linkInfo.id)
          }

          if (block.linkToPreviousBlock) {
            let linkInfo = block.linkToPreviousBlock
            this.selectedLinkId = linkInfo.id

            // blockの反対側のLink情報を消す
            let rightBarBlockId = this.selectedLink.rightBarPoint.blockId
            this.$store.commit('removeOneLinkFromLinksToNextBlock', {blockId: rightBarBlockId, linkId: linkInfo.id})
            this.removeLink(linkInfo.id)
          }
        } catch (e) {
          // console.log(e)
        }

        this.$store.commit('removeBlock', blockId)
        this.$store.commit('reconstructPipelines', this.links)

      },

      startDragBlock: function (ev, blockId, blockX, blockY) {
        if (this.dragging === "drawingPath") this.removeLink(this.selectedLinkId)

        this.dragging = "move";
        this.selectedBlockId = blockId;

        this.$nextTick(() => {
          //ページ左上とオブジェクト左上の差分から、ドラッグ開始位置（オブジェクト相対座標）を取得
          this.dragOffset.x = ev.offsetX - blockX;
          this.dragOffset.y = ev.offsetY - blockY;
        });

      },

      onPointerMove(ev) {
        if (this.dragging === "move") {
          //差分値を基点に反映
          let x = ev.offsetX - this.dragOffset.x;
          let y = ev.offsetY - this.dragOffset.y;
          // selectedBlockの x, yを取得
          let block = this.$store.getters.getBlock(this.selectedBlockId)
          // 今回のx, yとの差分をとる
          // 差分をpoint, pathに反映
          let diffX = x - block.x
          let diffY = y - block.y

          this.$store.commit('updateBlockPosition', {blockId: this.selectedBlockId, x: x, y: y})

          // Linkも同時に動かす
          for (let i in block.linksToNextBlock) {
            let linkInfo = block.linksToNextBlock[i]
            this.selectedLinkId = linkInfo.id
            let pathEdge = linkInfo.pathEdge
            let nowX = this.selectedLink.rightBarPoint.x
            let nowY = this.selectedLink.rightBarPoint.y
            this.selectedLink[pathEdge].x = nowX + diffX
            this.selectedLink[pathEdge].y = nowY + diffY
            this.selectedLink.rightBarPoint.x = nowX + diffX
            this.selectedLink.rightBarPoint.y = nowY + diffY
          }

          // for(let i in block.linkToPreviousBlock){
          if (block.linkToPreviousBlock) {
            // let linkInfo = block.linkToPreviousBlock[i]
            let linkInfo = block.linkToPreviousBlock
            this.selectedLinkId = linkInfo.id
            let pathEdge = linkInfo.pathEdge
            let nowX = this.selectedLink.leftBarPoint.x
            let nowY = this.selectedLink.leftBarPoint.y
            this.selectedLink[pathEdge].x = nowX + diffX
            this.selectedLink[pathEdge].y = nowY + diffY
            this.selectedLink.leftBarPoint.x = nowX + diffX
            this.selectedLink.leftBarPoint.y = nowY + diffY
          }

        }

        if (this.dragging === "firstPointMove") {
          let pathNode = this.selectedLink[this.selectedPointType].on
          let x = ev.offsetX - this.dragOffset.x;
          let y = ev.offsetY - this.dragOffset.y;
          let posOnBar = closestPoint(pathNode, [x, y])

          this.selectedLink[this.selectedPointType].x = posOnBar[0];
          this.selectedLink[this.selectedPointType].y = posOnBar[1];
        }

        if (this.dragging === "drawingPath") {
          let x = ev.offsetX - this.dragOffset.x
          let y = ev.offsetY - this.dragOffset.y
          // ポインタをpath上からずらしてイベント検知しやすくする
          if (this.selectedLink.pathStart.x < x) {
            this.selectedLink.pathEnd.x = x - 3
          } else {
            this.selectedLink.pathEnd.x = x + 3
          }
          this.selectedLink.pathEnd.y = y
        }

        if (this.dragging === "secondPointMove") {
          let pathNode = this.selectedLink[this.selectedPointType].on
          let x = ev.offsetX - this.dragOffset.x;
          let y = ev.offsetY - this.dragOffset.y;
          let posOnBar = closestPoint(pathNode, [x, y])

          this.selectedLink.pathEnd.x = posOnBar[0];
          this.selectedLink.pathEnd.y = posOnBar[1];
          this.selectedLink[this.selectedPointType].x = posOnBar[0];
          this.selectedLink[this.selectedPointType].y = posOnBar[1];
        }

      },

      onPointerDown(ev) {
        // キャンバス上のなにもない部分を押したとき、作成中のリンクを消す
        if (this.dragging === "drawingPath") this.removeLink(this.selectedLinkId)
      },

      stopDrag(ev) {
        if (this.dragging === "firstPointMove") {
          // Linkの最初の点の位置が定まったのでPathの描画にうつる
          this.dragging = "drawingPath";
          this.selectedLink.pathStart.x = this.selectedLink[this.selectedPointType].x;
          this.selectedLink.pathStart.y = this.selectedLink[this.selectedPointType].y;
        } else if (this.dragging !== "none") {
          this.dragging = "none";
        }

        this.selectedBlockId = "";
      },

      addLink(ev, point) {
        if (this.dragging === "drawingPath") {
          if (this.selectedPointType === point.pointType) {
            // サイドバーの種類が同じ場合、linkを消す
            this.selectedPointType = ""
            this.removeLink(this.selectedLinkId)

          } else {
            this.selectedPointType = point.pointType
            this.selectedLink[this.selectedPointType].blockId = point.blockId

            // 同じブロックの場合、リンクを消す
            if (this.selectedLink.leftBarPoint.blockId === this.selectedLink.rightBarPoint.blockId) {
              // linkを消す
              this.selectedPointType = ""
              this.removeLink(this.selectedLinkId)
              return
            }

            // leftSidebarにリンクが2つつながる場合、リンクを消す (同じリンクの場合を包含)
            if (this.doublePointsOnLeftSideBar()) {
              this.selectedPointType = ""
              this.removeLink(this.selectedLinkId)
              return
            }

            if (this.doesThisLinkMakeLoop()) {

            }

            // TODO: ループが形成されてしまう場合、リンクを消す
            this.selectedPointType = point.pointType
            this.dragging = "secondPointMove"

            this.selectedLink[this.selectedPointType].x = point.x
            this.selectedLink[this.selectedPointType].y = point.y
            this.selectedLink[this.selectedPointType].on = point.on
            this.selectedLink[this.selectedPointType].display = true

            this.updateLinkOfBlock() // this.selectedLink.leftBarPoint.blockId, this.selectedLink.rightBarPoint.blockId
            this.$store.commit('reconstructPipelines', this.links)
          }
          return
        }

        const link = {
          id: this.$store.getters.getNextLinkId,
          pointType: point.pointType,
          leftBarPoint: {x: 0, y: 0, on: "", display: false, blockId: 0},
          rightBarPoint: {x: 0, y: 0, on: "", display: false, blockId: 0},
          pathStart: {x: 0, y: 0},
          pathEnd: {x: 0, y: 0},
        }

        link[point.pointType].x = point.x
        link[point.pointType].y = point.y
        link.pathStart.x = point.x
        link.pathStart.y = point.y
        link.pathEnd.x = point.x
        link.pathEnd.y = point.y
        link[point.pointType].blockId = point.blockId
        link[point.pointType].on = point.on // sidebarの要素
        link[point.pointType].display = true

        this.$store.commit('incrementNextLinkId')
        this.dragging = "firstPointMove"
        this.links.push(link)
        this.selectedLinkId = link.id
        this.selectedPointType = point.pointType

        this.$nextTick(() => {
          //ページ左上とオブジェクト左上の差分から、ドラッグ開始位置（オブジェクト相対座標）を取得
          this.dragOffset.x = ev.offsetX - point.x;
          this.dragOffset.y = ev.offsetY - point.y;
        });

      },

      doesThisLinkMakeLoop: function () {
        // TODO
        return false
      },

      updateLinkOfBlock: function () {
        let rightBarBlockId = this.selectedLink.rightBarPoint.blockId
        let leftBarBlockId = this.selectedLink.leftBarPoint.blockId
        let rightBarBlockPathEdge
        let leftBarBlockPathEdge

        if (this.selectedPointType === 'leftBarPoint') {
          leftBarBlockPathEdge = 'pathEnd'
          rightBarBlockPathEdge = 'pathStart'
        } else {
          leftBarBlockPathEdge = 'pathStart'
          rightBarBlockPathEdge = 'pathEnd'
        }

        this.$store.commit('updateLinksToNextBlock', {
          blockId: rightBarBlockId,
          linkId: this.selectedLinkId,
          pathEdge: rightBarBlockPathEdge
        })
        this.$store.commit('updateLinkToPreviousBlock', {
          blockId: leftBarBlockId,
          linkId: this.selectedLinkId,
          pathEdge: leftBarBlockPathEdge
        })

      },


      hasSettingDefinition: function(processName){
        return Object.keys(settingDefinitions[this.nowProcessName]).length > 0
      },

      displayParameterSetting: function (blockId, processId) {
        this.nowProcessBlockId = blockId
        this.nowProcessName    = processDefinitions.find(process => process.processId === processId).name
        if(!this.hasSettingDefinition(this.nowProcessName)){
          return
        }

        let block = this.$store.getters.getBlock(blockId)

        let dialog = document.getElementById('parameter-setting-dialog')
        dialog.showModal()
      },


      displayFileInput: function (blockId) {
        let block = this.$store.getters.getBlock(blockId)
        this.nowInputFileBlockId             = blockId

        for(let i in block.parameters){
          this.nowFileParameters[i] = block.parameters[i]
        }

        let dialog = document.getElementById('input-dialog')
        dialog.showModal()
      },


      reconstructPipelines: function(){
        this.$store.commit('reconstructPipelines', this.links)
      },


      execPipeline: function(blockId){
        this.$emit('execPipeline', blockId)
      }

    }

  }
</script>

<style scoped>
  svg {
    width: 100%;
    height: 100%;
  }
</style>
