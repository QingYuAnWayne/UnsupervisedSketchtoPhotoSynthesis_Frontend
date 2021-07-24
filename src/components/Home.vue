<template>
  <el-container>
    <el-main>
      <el-popover placement="top-start" width="600" trigger="hover">
        <div style="float: left;font-size: 20px;font-family: 'Times New Roman'">
          Step1: Draw a freehand drawing of a shoe or select an example on the <br>bottom;<br>
          Step2: Select a reference on the bottom to determine the color and texture;<br>
          Step3: Click 'Transform' to get a real shoe picture.
        </div>
        <el-button type="info" slot="reference" style="float: left" plain>Guidance</el-button>
      </el-popover>
      <p style="font-family: 'Times New Roman';font-size: 35px;font-weight: bold;color: #003E3E" align="center">Unsupervised Sketch to Photo Synthesis Demo</p>
        <el-row>
          <div align="center" style="margin-bottom: 50px">
              <el-button @click="Draw" :type=isDraw style="margin-right: 10px">Draw</el-button>
              <el-popover placement="top-start" width="200">
                <el-slider v-model="value1" v-show="isEraser" :min="1" :max="100"></el-slider>
                <div style="font-size: 10px">Eraser Size</div>
                <div class="EraserSize" id="EraserSize"></div>
                <el-button @click="Eraser" :type="isEraser" slot="reference" style="margin-right: 10px">Eraser</el-button>
              </el-popover>
              <el-button @click="Del">Clear</el-button>
              <el-button @click="redoDraw">Redo</el-button>
              <el-button @click="undoDraw">Undo</el-button>
              <el-button @click="Transfer" type="success" style="margin-top: 10px">Transfer</el-button>
            </div>
          <el-col :span="12">
            <el-card align="center" style="height: 550px">
              <canvas id="canvas" width="512" height="512" style="border-style: dashed"></canvas>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card style="height: 550px">
              <div style="border-style: dashed;height: 512px;width: 512px;margin: auto">
                <el-image v-show="isShow" style="height: 512px;width: 512px" :src="'data:image/png;base64,'+this.image"></el-image>
              </div>
            </el-card>
          </el-col>
        </el-row>
      <el-divider></el-divider>
      <div>
        <div style="font-size: 30px;font-family: 'Times New Roman'">Select Examples
         <el-button round type="primary" size="mini" style="float: right" @click="getExample"><i class="el-icon-refresh"></i>More</el-button>
        </div>
        <vue-select-image :dataImages="examples" @onselectimage="onSelectExample" :h="210" :w="210" ref="select">
        </vue-select-image>
      </div>
      <el-divider></el-divider>
      <div>
        <div style="font-size: 30px;font-family: 'Times New Roman'">Select Reference
          <el-button round type="primary" size="mini" style="float: right" @click="getRef"><i class="el-icon-refresh"></i>More</el-button>
        </div>
        <vue-select-image :dataImages="references" @onselectimage="onSelectImage" :h="210" :w="210">
        </vue-select-image>
      </div>
    </el-main>
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
      examples: [],
      value1: 10,
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
    this.examples = []
    var url = this.publicPath + 'sketch/'
    for(var i = 0; i<5;i++)
    {
      var num = [2,44,66,88,99];
      this.examples.push(
          {
            id: i,
            src: url+num[i].toString()+'.png'
          })
    }
    this.references = []
    url = this.publicPath + 'reference/'
    for(i = 0; i<5;i++)
    {
      num = [0,2,9,75,55];
      this.references.push(
          {
            id: i,
            src: url+num[i].toString()+'.png'
          })
    }
  },
  watch:{
    value1: function(){
      var ele = document.getElementById('EraserSize')
      ele.style.height = this.value1+ 'px'
      ele.style.width = this.value1 + 'px'
      this.canvas.freeDrawingBrush.width = this.value1
    }
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
      this.$refs.select.removeFromSingleSelected()
      // this.$refs.select.$emit("removeFromSingleSelected")

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
        input_image: dataURL,
        reference: this.imageSelected
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
      this.canvas.isDrawingMode = true
      this.canvas.freeDrawingBrush.width = this.value1
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
      this.imageSelected = data.src.split('/reference/')[1]
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
      for(var i = 0; i<5;i++)
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
      for(var i = 0; i<5;i++)
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
.EraserSize{
  border: 1px solid black;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
}
</style>