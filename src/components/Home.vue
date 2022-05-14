<template>
  <el-container>
    <el-header style="height: 20%">
        <div style="float: left">
          <el-button @click="drawer=true"
                     style="background-color: #f6a8c0; color: white;font-size: 20px" round>
            ?
          </el-button>
        </div>
        <div style="float: right">
          <el-button style="background-color: #6fa6d8;" round>
            <a href="https://arxiv.org/pdf/1909.08313.pdf" style="color: white;font-family: 'Times New Roman';font-weight: bold;font-size: 20px">Paper</a>
          </el-button>
          <el-button style="background-color: #4164a1;" round>
            <a href="https://github.com/rt219/Unsupervised-Sketch-to-Photo-Synthesis" style="color: white;font-family: 'Times New Roman';font-weight: bold;font-size: 20px">Code</a>
          </el-button>
        </div>
      <el-drawer
          size="100%"
          :visible.sync="drawer"
          :with-header="false">
        <div style="width: 100%;height: 100%; background-color: #f6b8a6">
          <el-button @click="drawer=false"
                     style="background-color: white; color: #f6b8a6;
                       font-size: 20px;float: right;margin-right: 1%;
                       margin-top: 1%" round>
            X
          </el-button>
          <div style="font-size: 40px;padding-top: 10%;font-family:'BH',serif;color: #582d2d" align="center">
            Guidance
            <div style="font-size: 35px;text-align: left;width: 80%">
              <p>
                <a style="font-weight: bold;">Step1:</a> Draw a sketch image or directly select one from examples provided on the bottom;<br>
              </p>
              <p>
                <a style="font-weight: bold">Step 2 (optional):</a>Select a reference image listed on the side to control the color and texture of the synthesised shoe;
                <br>
              </p>
              <p>
                <a style="font-weight: bold">Step3:</a> Click “Translate’ button and get your designed shoe!
              </p>
            </div>
          </div>
        </div>
      </el-drawer>

    </el-header>
    <el-main>
      <div v-show="isShowLogo">
        <div align="center">
          <img src="@/assets/Draw_Pic.png" style="width: 30%">
          <h1 style="font-family: 'GS'">
            Want your personalized shoes?
          </h1>
          <el-button type="warning" @click="isShowLogo = !isShowLogo">
            <div style="font-size: 20px">
              Try ME!
            </div>
          </el-button>
        </div>
      </div>
      <div v-show="!isShowLogo">
        <div align="center">
          <img src="@/assets/Sketch.png" style="width: 30%">
          <img src="@/assets/Logo_11.png" style="width: 30%">
          <img src="@/assets/Shoes.png" style="width: 30%">
        </div>
        <el-row>
          <el-col :span="2">
            <el-menu >
              <el-popover placement="top-start" width="200">
                  <el-slider v-model="value2" v-show="isDraw" :min="3" :max="20"></el-slider>
                  <div style="font-size: 10px">Brush Size</div>
                  <div class="BrushSize" id="BrushSize"></div>
                  <el-button @click="Draw" :type=isDraw slot="reference" style="width: 100px;margin-bottom: 15px" round>
                    Draw
                  </el-button>
                </el-popover>
              <el-popover placement="top-start" width="200">
                <el-slider v-model="value1" v-show="isEraser" :min="1" :max="100"></el-slider>
                <div style="font-size: 10px">Eraser Size</div>
                <div class="EraserSize" id="EraserSize"></div>
                <el-button @click="Eraser" style="width: 100px;margin-bottom: 24px" :type="isEraser" slot="reference" round>Eraser</el-button>
              </el-popover>
              <el-button @click="Del"  style="width: 100px;margin-bottom: 24px" round>Clear</el-button>
              <div style="margin-left: -10px">
                <el-button @click="redoDraw" style="width: 100px;margin-bottom: 25px;margin-left: 10px" round>Redo</el-button>
                <el-button @click="undoDraw" style="width: 100px;margin-bottom: 25px" round>Undo</el-button>
                <el-button @click="ShowExample=true" style="width: 100px;margin-bottom: 24px" round>Example</el-button>
                <el-button @click="ShowReference=true" style="width: 100px;margin-bottom: 24px" round>Reference</el-button>
                <el-button @click="Transfer" type="success" style="width: 100px;margin-bottom: 24px" round>
                  Transfer
                </el-button>
                <el-button @click="Save" :disabled="!isShow" style="width: 100px" round>Save</el-button>

              </div>
            </el-menu>
          </el-col>

          <el-col :span="11">
            <el-card align="center" style="height: 550px">
              <canvas id="canvas" width="512" height="512" style="border-style: dashed"></canvas>
            </el-card>
          </el-col>
          <el-col :span="11">
            <el-card style="height: 550px">
              <div style="border-style: dashed;height: 512px;width: 512px;margin: auto">
                <el-image v-show="isShow" style="height: 512px;width: 512px" :src="'data:image/png;base64,'+this.image"></el-image>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-drawer
            size="20%"
            :visible.sync="ShowExample"
            direction="rtl">
          <div slot="title" style="margin-bottom: -25px">
            <div style="font-size: 30px;font-family: 'Times New Roman';color: black">Select Examples</div>
            <el-button style="float: left" round type="primary" size="mini" @click="getExample"><i class="el-icon-refresh"></i>More</el-button>
          </div>
          <div>
            <vue-select-image :dataImages="examples" @onselectimage="onSelectExample" :h="210" :w="210" ref="select">
            </vue-select-image>
          </div>
        </el-drawer>
        <el-drawer size="20%"
           :visible.sync="ShowReference"
           direction="rtl">
          <div slot="title" style="margin-bottom: -25px">
            <div style="font-size: 30px;font-family: 'Times New Roman';color: black">Select Reference</div>
            <el-button-group>
              <el-button round type="primary" style="width: 80px" size="mini" @click="getRef"><i class="el-icon-refresh"></i>More</el-button>
              <el-button round type="danger" style="width: 120px" size="mini" @click="ClearRef">Clear Reference</el-button>
            </el-button-group>
          </div>
          <vue-select-image :dataImages="references" @onselectimage="onSelectImage" :h="210" :w="210" ref="reference">
          </vue-select-image>
        </el-drawer>
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
      value2: 3,
      visible: true,
      isShowLogo: true,
      drawer: false,
      ShowExample: false,
      ShowReference: false
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
    },
    value2: function(){
      var ele = document.getElementById('BrushSize')
      ele.style.height = this.value2 + 'px'
      ele.style.width = this.value2 + 'px'
      this.canvas.freeDrawingBrush.width = this.value2
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
    ClearRef(){
      this.$refs.reference.removeFromSingleSelected()
      this.imageSelected = []
    },
    Save(){
      const link = document.createElement('a');
      link.download = 'canvas.png';
      link.href = this.image;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
.BrushSize{
  border: 1px solid black;
  border-radius: 50%;
  width: 3px;
  height: 3px;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
}
</style>