<template>
  <el-container>
    <el-main>
      <p style="font-family: 'Times New Roman';font-size: 35px;font-weight: bold;color: #003E3E" align="center">Unsupervised Sketch to Photo Synthesis Demo</p>

        <el-row>
          <el-col :span="12">
            <div style="height: 100px">
            <div align="center" style="margin: 10px">
              <el-button @click="Draw" :type=isDraw>Draw</el-button>
              <el-button @click="Eraser" :type="isEraser">Eraser</el-button>
            </div>
            <div align="center" style="margin: 10px">
              <el-button @click="isExamples=true">Select Examples</el-button>
              <el-button @click="Del">Clear</el-button>
              <el-button @click="Transfer">Transfer</el-button>
              <el-button @click="redoDraw">Redo</el-button>
              <el-button @click="undoDraw">Undo</el-button>
            </div>
            </div>
            <el-card align="center" style="height: 550px">
              <canvas id="canvas" width="512" height="512" style="border-style: dashed"></canvas>
            </el-card>
          </el-col>
          <el-col :span="12">
            <div style="height: 100px">
              <div align="center" style="margin: 10px">
                <el-button @click="isSelect=true">Select References</el-button>

                <el-button @click="Save">Save</el-button>
              </div>
            </div>
            <el-card style="height: 550px">
              <div style="border-style: dashed;height: 512px;width: 512px;margin: auto">
                <el-image style="height: 512px;width: 512px" :src="this.image"></el-image>
              </div>
            </el-card>
          </el-col>
        </el-row>
      <div>
        <h3></h3>

      </div>
    </el-main>
    <el-drawer
        title="Select Examples"
        :append-to-body="true"
        :visible.sync="isExamples">
      <vue-select-image :dataImages="examples" @onselectimage="onSelectExample">
      </vue-select-image>
    </el-drawer>
    <el-drawer
        title="Select Reference"
        :append-to-body="true"
        :visible.sync="isSelect">
      <vue-select-image :dataImages="references" @onselectimage="onSelectImage">
      </vue-select-image>
    </el-drawer>
  </el-container>
</template>

<script>
import image1 from '@/assets/examples/1.png'
import VueSelectImage from 'vue-select-image';
import { fabric } from "fabric";
import axios from "axios";

require('vue-select-image/dist/vue-select-image.css')
export default {
  name: "Home",
  components:{ VueSelectImage},
  data(){
    return{
      canvas: null,
      image: 'data:image/png;base64,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',
      isDraw: '',
      isEraser: '',
      log: [],
      exception: false,
      isRedoing: false,
      isSelect: false,
      references: [{
        id: '1',
        src:'data:image/png;base64,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',
        alt: 'Alt Image 1'
      }, {
        id: '2',
        src:'data:image/png;base64,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',
        alt: 'Alt Image 2'
      }],
      imageSelected: [],
      isExamples:false,
      examples: [{
        id: '1',
        src: image1,
        alt: 'Alt Image 1'
      }]
    }
  },
  mounted() {
    this.canvas = new fabric.Canvas('canvas')
    this.Draw()
    this.canvas.on('object:added', () => {
      if(this.isRedoing === false){
        this.log = [];
      }
    });

  },
  methods:{
    Draw(){
      this.isEraser = ''
      this.isDraw = 'primary'
      this.canvas.freeDrawingBrush.width = 3
      this.canvas.isDrawingMode = true;
      this.canvas.freeDrawingBrush.color = '#000000'
      this.canvas.on
    },
    Del() {
      this.canvas.clear()
    },
    Transfer(){
      const dataURL = this.canvas.toDataURL({
        width: this.canvas.width,
        height: this.canvas.height,
        left: 0,
        top: 0,
        format: 'png',
      });
      axios.post('http://localhost:8000/transfer', {
        input_image: dataURL
      }).then(res=>{
        if(res.data.code === 200)
        {
          this.image = res.data.output_image
        }
        else
        {
          if (this.exception)
            alert('error!')
          else
            console.log('error!')
        }
      }).catch(error=>{
        console.log(error)
      })

    },
    Eraser(){
      this.isDraw = ''
      this.isEraser = 'primary'
      this.canvas.freeDrawingBrush.width = 10
      this.canvas.isDrawingMode = true
      this.canvas.freeDrawingBrush.color = "#FFFFFF"
    },
    undoDraw(){
      if(this.canvas._objects.length > 0){
        this.log.push(this.canvas._objects.pop());
        this.canvas.renderAll();
      }
    },
    redoDraw(){
      if(this.log.length > 0){
        this.isRedoing = true;
        this.canvas.add(this.log.pop());
        this.canvas.renderAll();
      }
    },
    Save(){
      console.log(this.imageSelected)
    },
    onSelectImage: function (data) {
      console.log('fire event onSelectImage: ', data)
      this.imageSelected = data
    },
    onSelectExample: function (data) {
      var imgObj = new Image()
      imgObj.src = data.src
      var image = new fabric.Image(imgObj)
      image.set({
        scaleX:512/400,
        scaleY:512/400
      })
      this.canvas.centerObject(image)
      this.canvas.add(image)
      this.canvas.renderAll()
    }
  }
}
</script>

<style scoped>
</style>