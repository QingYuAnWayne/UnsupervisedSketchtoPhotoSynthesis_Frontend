<template>
  <el-container direction="vertical">
    <el-main>
      <p style="font-family: 'Times New Roman';font-size: 35px;font-weight: bold;color: #003E3E" align="center">Unsupervised Sketch to Photo Synthesis</p>
      <p align="center" style="font-family: 'Times New Roman';font-weight: bold;font-size: 20px">
        <a>Runtao Liu<sup>1</sup></a>
        <a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
        <a href="https://yuqian1023.github.io/">Qian Yu<sup>1,2</sup></a>
        <a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
        <a>Stella X. Yu <sup>1</sup></a>
      </p>
      <p align="center" style="font-family: 'Times New Roman';font-weight: bold;font-size: 20px"><sup>1</sup>UC Berkeley/ICSI, Berkeley, USA</p>
      <p align="center" style="font-family: 'Times New Roman';font-weight: bold;font-size: 20px"><sup>2</sup>Beihang University,</p>
      <p align="center" style="font-family: 'Times New Roman';font-weight: bold;font-size: 20px">Xueyuan Rd. No. 37, Haidian District, Beijing, China</p>
      <p align="center" style="font-weight: bold;font-size: 20px"> Accepted by ECCV 2020</p>
      <div align="center">
        <img src="@/assets/1.png" style="width: 80%">
      </div>
      <p>
        <a style="font-weight: bold">Figure:</a>
        Our model can produce high-fidelity and diverse photos from a sketch. Result comparisons. Most baselines cannot handle this task well. While UGATIT can generate realistic photos, our results are more faithful to the input sketch, e.g., the three chair examples.
      </p>
      <p style="font-family: 'Times New Roman';font-weight: bold;font-size: 20px" align="center">Abstract. </p>
      <p style="text-indent: 20px">
        Humans can envision a realistic photo given a free-hand sketch that is not only spatially imprecise and geometrically distorted but also without colors and visual details. We study unsupervised sketch to photo synthesis for the first time, learning from unpaired sketch and photo data where the target photo for a sketch is unknown during train- ing. Existing works only deal with either style difference or spatial defor- mation alone, synthesizing photos from edge-aligned line drawings or transforming shapes within the same modality, e.g., color images.
      </p>
      <p style="text-indent: 20px">
        Our insight is to decompose the unsupervised sketch to photo syn- thesis task into two stages of translation: First shape translation from sketches to grayscale photos and then content enrichment from grayscale to color photos. We also incorporate a self-supervised denoising objec- tive and an attention module to handle abstraction and style variations that are specific to sketches. Our synthesis is sketch-faithful and photo- realistic, enabling sketch-based image retrieval and automatic sketch gen- eration that captures human visual perception beyond the edge map of a photo.
      </p>
      <el-row>
        <el-col :span="8">
          <div align="center">
            <img src="@/assets/2.png" style="width: 50%">
          </div>
        </el-col>
        <el-col :span="16">
          <div>
            <p style="font-weight: bold;color: #003E3E;font-family: 'Times New Roman';font-size: 25px">Paper</p>
            <a href="https://arxiv.org/pdf/1909.08313.pdf" style="font-family: 'Times New Roman';font-weight: bold;font-size: 20px">Unsupervised Sketch to Photo Synthesis</a>
          </div>
          <div>
            <p style="font-weight: bold;color: #003E3E;font-family: 'Times New Roman';font-size: 25px">Code</p>
            <a href="https://github.com/rt219/Unsupervised-Sketch-to-Photo-Synthesis" style="font-family: 'Times New Roman';font-weight: bold;font-size: 20px">Pytorch</a>
          </div>
          <div>
            <p style="font-weight: bold;color: #003E3E;font-family: 'Times New Roman';font-size: 25px">System</p>
            <el-button @click="goHome" type="primary">Online System</el-button>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "index",
  methods:{
    goHome(){
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>

</style>