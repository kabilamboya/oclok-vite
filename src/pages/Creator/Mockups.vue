<template>
  <section class="mockups-wrapper">
    <RteLayout :zoom="zoom" columns="280px 1fr" aside-position="left">
      <template #toolbar>
        <CreatorToolbar
          :initial-zoom="zoom"
          current-page="mockups"
          @zoom-change="handleZoomChange"
          @tool-selected="selectedTool = $event"
          @delete-element="removeSelectedLayer"
        />
      </template>

      <template #aside>
        <!-- LEFT SIDEBAR -->
        <div class="panel tools-panel">
          <div class="tools-header">
            <h3>Mockup Studio</h3>
          </div>

          <p class="muted">Create and edit mockups.</p>

          <!-- Upload -->
          <div class="tool-section">
            <h3>Upload</h3>

            <form class="upload-form" @submit.prevent="onUpload">
              <input v-model="form.name" placeholder="Name" required>

              <input type="file" accept="image/*" @change="onFileChange">

              <button type="submit">
                Upload
              </button>
            </form>
          </div>

          <!-- Tools -->
          <div class="tool-section">
            <h3>Tools</h3>

            <div class="tool-grid">
              <button @click="addTextLayer">
                Text
              </button>

              <button @click="addRectLayer">
                Rectangle
              </button>

              <button @click="addCircleLayer">
                Circle
              </button>

              <button @click="removeSelectedLayer">
                Delete
              </button>
            </div>
          </div>

          <!-- Shape Color Customization -->
          <div class="tool-section">
            <h3>Shape Colors</h3>

            <label>
              Rectangle Color
              <input type="color" v-model="shapeColors.rect" title="Choose rectangle color">
            </label>

            <label>
              Circle Color
              <input type="color" v-model="shapeColors.circle" title="Choose circle color">
            </label>

            <p class="muted" style="font-size: 0.85rem; margin-top: 8px;">Apply before adding shapes</p>
          </div>

          <!-- Drawing -->
          <div class="tool-section">
            <h3>Brush</h3>

            <button @click="toggleDrawingMode">
              Draw
            </button>

            <button @click="clearCanvasObjects">
              Clear
            </button>

            <label>
              Size
              <input type="range" min="1" max="48"
              v-model.number="brushSize">
            </label>

            <label>
              Color
              <input type="color" v-model="brushColor">
            </label>
          </div>

          <!-- Layer -->
          <div class="tool-section">
            <h3>Element Color</h3>

            <label>
              Fill Color
              <input type="color" v-model="elementColor" @input="applyElementColor" title="Change selected element color">
            </label>
          </div>

          <!-- Layer Controls -->
          <div class="tool-section">
            <h3>Layer Controls</h3>

            <label>
              Opacity
              <input type="range"
              min="10"
              max="100"
              v-model.number="layerControls.opacity"
              @input="applyLayerControls">
            </label>

            <label>
              Scale
              <input type="range"
              min="20"
              max="220"
              v-model.number="layerControls.scale"
              @input="applyLayerControls">
            </label>

            <label>
              Rotate
              <input type="range"
              min="-180"
              max="180"
              v-model.number="layerControls.angle"
              @input="applyLayerControls">
            </label>
          </div>
        </div>
      </template>

      <template #main>
        <!-- WORKSPACE -->
        <div class="panel workspace-panel">
          <div class="header-row">
            <h2>Create and share mockups</h2>

            <div class="header-actions">
              <button @click="downloadCanvas">
                Export
              </button>
            </div>
          </div>

          <div class="workspace-grid">
            <div class="canvas-stage">
              <canvas ref="canvasElement" width="1280" height="1440"></canvas>
            </div>
          </div>
        </div>
      </template>
    </RteLayout>
  </section>
</template>


<script setup>

import { ref, reactive, watch, onMounted } from "vue"

import CreatorToolbar from "@/components/TopToolbar.vue"
import RteLayout from "@/layouts/RteLayout.vue"

import {
Canvas as FabricCanvas,
Textbox,
Rect,
Circle,
FabricImage,
PencilBrush
} from "fabric"

const canvasElement = ref(null)
const studioCanvas = ref(null)
const zoom = ref(100)
const selectedTool = ref("select")

const drawingMode = ref(false)
const brushSize = ref(8)
const brushColor = ref("#ff6600")

const elementColor = ref("#ff6600")

const layerControls = reactive({
opacity:100,
scale:100,
angle:0
})

const shapeColors = reactive({
  rect: "rgba(255,102,0,0.5)",
  circle: "rgba(255,214,0,0.7)"
})

const form = reactive({
name:""
})

const file = ref(null)



function initCanvas(){

studioCanvas.value = new FabricCanvas(canvasElement.value,{
backgroundColor:"#0d0d0d",
preserveObjectStacking:true
})

updateBrushSettings()

}



function addTextLayer(){

const text = new Textbox("Edit text",{

left:120,
top:120,
width:260,
fontSize:36,
fill:"#ffffff"

})

studioCanvas.value.add(text)
studioCanvas.value.setActiveObject(text)

}



function addRectLayer(){

const rect = new Rect({

left:150,
top:250,
width:260,
height:120,
fill:shapeColors.rect

})

studioCanvas.value.add(rect)
studioCanvas.value.setActiveObject(rect)

}



function addCircleLayer(){

const circle = new Circle({

left:450,
top:150,
radius:70,
fill:shapeColors.circle

})

studioCanvas.value.add(circle)
studioCanvas.value.setActiveObject(circle)

}



function removeSelectedLayer(){

const selected = studioCanvas.value.getActiveObjects()

selected.forEach(obj=>{
studioCanvas.value.remove(obj)
})

studioCanvas.value.discardActiveObject()
studioCanvas.value.requestRenderAll()

}



function toggleDrawingMode(){

drawingMode.value=!drawingMode.value
updateBrushSettings()

}



function updateBrushSettings(){

if(!studioCanvas.value) return

studioCanvas.value.isDrawingMode=drawingMode.value

if(drawingMode.value){

studioCanvas.value.freeDrawingBrush=new PencilBrush(studioCanvas.value)

studioCanvas.value.freeDrawingBrush.width=brushSize.value

studioCanvas.value.freeDrawingBrush.color=brushColor.value

}

}



watch([brushSize,brushColor,drawingMode],updateBrushSettings)



function applyLayerControls(){

const active=studioCanvas.value.getActiveObject()

if(!active) return

active.set({

opacity:layerControls.opacity/100,

scaleX:layerControls.scale/100,
scaleY:layerControls.scale/100,

angle:layerControls.angle

})

studioCanvas.value.requestRenderAll()

}


function clearCanvasObjects(){

studioCanvas.value.getObjects().forEach(o=>{
studioCanvas.value.remove(o)
})

}



function downloadCanvas(){

const url=studioCanvas.value.toDataURL({
format:"png",
multiplier:2
})

const link=document.createElement("a")

link.href=url
link.download="mockup.png"

link.click()

}



function onFileChange(e){

file.value=e.target.files[0]

const reader=new FileReader()

reader.onload=async ()=>{
const img=await FabricImage.fromURL(reader.result)

img.scaleToWidth(400)

studioCanvas.value.add(img)

}

reader.readAsDataURL(file.value)

}



function onUpload(){
alert("Upload logic can stay from your service API")
}

function loadDefaultMockup(){
  // Load default t-shirt mockup asset
  FabricImage.fromURL('/mockups/tshirt.png').then((img)=>{
    img.scaleToWidth(400)
    img.set({
      left:300,
      top:100
    })
    studioCanvas.value.add(img)
    studioCanvas.value.renderAll()
  }).catch((err)=>{
    console.error('Error loading default mockup:', err)
  })
}

function handleZoomChange(v){
  zoom.value = v
}

onMounted(()=>{
 initCanvas()
 loadDefaultMockup()
})


</script>


<style scoped>

.mockups-wrapper{
  height:100%;
  display:flex;
  flex-direction:column;
}


.canvas-stage{
border:1px solid #333;
background:#000;
padding:8px;
}

canvas{
width:100%;
height:100%;
}

.panel{
background:#151515;
padding:1rem;
border-radius:10px;
}

.tool-grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:6px;
}

button{
background:#ffd600;
border:none;
padding:8px;
border-radius:6px;
cursor:pointer;
}

.muted{
color:#aaa;
}

</style>
