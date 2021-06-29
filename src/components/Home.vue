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
              <el-button @click="Transfer" type="success">Transfer</el-button>
            </div>
            <div align="center" style="margin: 10px">
              <el-button @click="selectExample">Select Examples</el-button>
              <el-button @click="Del">Clear</el-button>
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
                <el-button @click="selectRef">Select References</el-button>
              </div>
            </div>
            <el-card style="height: 550px">
              <div style="border-style: dashed;height: 512px;width: 512px;margin: auto">
                <el-image v-show="isShow" style="height: 512px;width: 512px" :src="'data:image/png;base64,'+this.image"></el-image>
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
import VueSelectImage from 'vue-select-image';
import { fabric } from "fabric";
import axios from "axios";


require('vue-select-image/dist/vue-select-image.css')
export default {
  name: "Home",
  components:{ VueSelectImage},
  data(){
    return{
      publicPath: process.env.BASE_URL,
      canvas: null,
      image: '',
      isDraw: '',
      isEraser: '',
      log: [],
      isShow: false,
      exception: false,
      isRedoing: false,
      isSelect: false,
      references: [],
      imageSelected: [],
      isExamples:false,
      examples: []
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
    this.getExample()
    this.getRef()
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
      axios.post('http://localhost:8000/transform', {
        input_image: dataURL
      }).then(res=>{
        if(res.data.status === 200)
        {
          this.image = res.data.output_image
          this.image = this.image.substring(2, this.image.length - 1)
          this.isShow = true
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
    onSelectImage: function (data) {
      console.log('fire event onSelectImage: ', data)
      this.imageSelected = data
      this.isSelect = false
    },
    onSelectExample: function (data) {
      this.isExamples = false
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
    },
    getExample(){
      this.examples = []
      var url = this.publicPath + 'sketch/'
      for(var i = 0; i<20;i++)
      {
        var num = Math.round(Math.random() * 665);
        this.examples.push(
            {
              id: i,
              src: url+num.toString()+'.png'
            })
      }
    },
    getRef(){
      this.references = []
      var url = this.publicPath + 'reference/'
      for(var i = 0; i<20;i++)
      {
        var num = Math.round(Math.random() * 665);
        this.references.push(
            {
              id: i,
              src: url+num.toString()+'.png'
            })
      }
    },
    selectExample(){
      this.isExamples=true;
    },
    selectRef(){
      this.isSelect=true
    }
  }
}
</script>

<style scoped>
</style>