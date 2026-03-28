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
            <h3>Upload Design</h3>

            <form class="upload-form" @submit.prevent="onUpload">
              <input v-model="form.name" placeholder="Name" required>

              <input type="file" accept="image/*" @change="onFileChange">

              <button type="submit">
                Upload
              </button>
            </form>
            <p class="muted">Designs snap into the print area automatically.</p>
          </div>

          <div class="tool-section">
            <h3>Mockup</h3>

            <label>
              Mockup Color
              <input type="color" v-model="mockupColor" @input="applyMockupColor" title="Tint mockup color">
            </label>

            <label>
              Tint Strength
              <input type="range" min="0" max="100" v-model.number="mockupTintStrength" @input="applyMockupColor">
            </label>

            <div class="tool-grid">
              <button :class="{ active: mockupOrientation === 'portrait' }" @click="setMockupOrientation('portrait')">
                Portrait
              </button>
              <button :class="{ active: mockupOrientation === 'landscape' }" @click="setMockupOrientation('landscape')">
                Landscape
              </button>
            </div>
            <p class="muted">Orientation adjusts the print area fit.</p>
          </div>

          <div class="tool-section">
            <h3>Design</h3>
            <div class="tool-grid">
              <button @click="fitDesignToPrintArea">
                Fit to Area
              </button>
              <button @click="centerDesignInPrintArea">
                Center
              </button>
              <button @click="removeDesignImage">
                Remove
              </button>
            </div>
            <p class="muted">Select the design on canvas to rotate or scale.</p>
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

const mockupImage = ref(null)
const mockupTintLayer = ref(null)
const designImage = ref(null)

const drawingMode = ref(false)
const brushSize = ref(8)
const brushColor = ref("#ff6600")

const elementColor = ref("#ff6600")
const mockupColor = ref("#f5f5f5")
const mockupTintStrength = ref(35)
const mockupOrientation = ref("portrait")

const printArea = reactive({
  left: 0,
  top: 0,
  width: 0,
  height: 0
})

const printAreaOutline = ref(null)
let isConstraining = false

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
studioCanvas.value.renderAll()
bindDesignConstraints()

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
 if(obj?.data?.role === "mockup" || obj?.data?.role === "tint" || obj?.data?.role === "print-area"){
   return
 }
 if(obj?.data?.role === "design"){
   designImage.value = null
 }
 studioCanvas.value.remove(obj)
})

studioCanvas.value.discardActiveObject()
studioCanvas.value.requestRenderAll()

}

function removeDesignImage(){
  if(!designImage.value) return
  studioCanvas.value.remove(designImage.value)
  designImage.value = null
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
  if(active?.data?.role === "design"){
    enforceDesignBounds()
  }

}

function applyElementColor(){
  const active = studioCanvas.value.getActiveObject()
  if(!active) return
  if("fill" in active){
    active.set({ fill: elementColor.value })
    studioCanvas.value.requestRenderAll()
  }
}


function clearCanvasObjects(){

studioCanvas.value.getObjects().forEach(o=>{
  if(o?.data?.role === "mockup" || o?.data?.role === "tint" || o?.data?.role === "print-area" || o?.data?.role === "design"){
    return
  }
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
if(!file.value) return

const reader=new FileReader()

reader.onload=async ()=>{
const img=await FabricImage.fromURL(reader.result)

img.set({
  left:0,
  top:0,
  selectable:true,
  hasControls:true,
  lockUniScaling:true,
  data:{ role:"design" }
})

if(designImage.value){
  studioCanvas.value.remove(designImage.value)
}

designImage.value = img
studioCanvas.value.add(img)
fitDesignToPrintArea()
applyDesignClip()
studioCanvas.value.setActiveObject(img)
studioCanvas.value.requestRenderAll()

}

reader.readAsDataURL(file.value)

}



function onUpload(){
 if(!file.value) return
 // Local file is already placed on the canvas.
 // Keep this handler for future API uploads.
}

function loadDefaultMockup(){
  // Load default t-shirt mockup asset
  FabricImage.fromURL('/mockups/tshirt.png').then((img)=>{
    img.scaleToWidth(520)
    const canvasWidth = canvasElement.value?.width || 1280
    const canvasHeight = canvasElement.value?.height || 1440
    img.set({
      originX: "center",
      originY: "center",
      left: canvasWidth / 2,
      top: canvasHeight / 2,
      selectable:false,
      evented:false,
      data:{ role:"mockup" }
    })
    mockupImage.value = img
    studioCanvas.value.add(img)
    updatePrintArea()
    applyMockupColor()
    studioCanvas.value.renderAll()
  }).catch((err)=>{
    console.error('Error loading default mockup:', err)
  })
}

function handleZoomChange(v){
  zoom.value = v
}

function getMockupBounds(){
  if(!mockupImage.value) return null
  mockupImage.value.setCoords()
  return mockupImage.value.getBoundingRect(true)
}

function updatePrintArea(){
  const bounds = getMockupBounds()
  if(!bounds) return

  const ratios = mockupOrientation.value === "landscape"
    ? { width:0.72, height:0.45, top:0.28 }
    : { width:0.56, height:0.62, top:0.18 }

  printArea.width = bounds.width * ratios.width
  printArea.height = bounds.height * ratios.height
  printArea.left = bounds.left + (bounds.width - printArea.width) / 2
  printArea.top = bounds.top + bounds.height * ratios.top

  updatePrintOutline()
  applyDesignClip()
  if(designImage.value){
    fitDesignToPrintArea()
  }
  studioCanvas.value?.requestRenderAll()
}

function updatePrintOutline(){
  if(!studioCanvas.value) return
  if(!printAreaOutline.value){
    printAreaOutline.value = new Rect({
      left: printArea.left,
      top: printArea.top,
      width: printArea.width,
      height: printArea.height,
      fill: "transparent",
      stroke: "#ffd600",
      strokeDashArray: [8,6],
      selectable: false,
      evented: false,
      data: { role: "print-area" }
    })
    studioCanvas.value.add(printAreaOutline.value)
  }else{
    printAreaOutline.value.set({
      left: printArea.left,
      top: printArea.top,
      width: printArea.width,
      height: printArea.height
    })
  }
  printAreaOutline.value.bringToFront()
}

function applyDesignClip(){
  if(!designImage.value) return
  if(!printArea.width || !printArea.height) return
  designImage.value.clipPath = new Rect({
    left: printArea.left,
    top: printArea.top,
    width: printArea.width,
    height: printArea.height,
    absolutePositioned: true
  })
}

function fitDesignToPrintArea(){
  if(!designImage.value) return
  if(!printArea.width || !printArea.height) return
  const maxWidth = printArea.width
  const maxHeight = printArea.height
  const scale = Math.min(maxWidth / designImage.value.width, maxHeight / designImage.value.height)

  designImage.value.scale(scale)
  designImage.value.set({
    left: printArea.left + (maxWidth - designImage.value.getScaledWidth()) / 2,
    top: printArea.top + (maxHeight - designImage.value.getScaledHeight()) / 2
  })
  designImage.value.setCoords()
  studioCanvas.value?.requestRenderAll()
}

function centerDesignInPrintArea(){
  if(!designImage.value) return
  if(!printArea.width || !printArea.height) return
  designImage.value.set({
    left: printArea.left + (printArea.width - designImage.value.getScaledWidth()) / 2,
    top: printArea.top + (printArea.height - designImage.value.getScaledHeight()) / 2
  })
  designImage.value.setCoords()
  studioCanvas.value?.requestRenderAll()
}

function bindDesignConstraints(){
  if(!studioCanvas.value) return
  const handler = (evt) => {
    if(!evt?.target) return
    if(evt.target?.data?.role !== "design") return
    enforceDesignBounds()
  }
  studioCanvas.value.on("object:moving", handler)
  studioCanvas.value.on("object:scaling", handler)
  studioCanvas.value.on("object:rotating", handler)
  studioCanvas.value.on("object:modified", handler)
}

function enforceDesignBounds(){
  if(isConstraining) return
  if(!designImage.value) return
  if(!printArea.width || !printArea.height) return

  isConstraining = true

  const obj = designImage.value
  const areaLeft = printArea.left
  const areaTop = printArea.top
  const areaRight = printArea.left + printArea.width
  const areaBottom = printArea.top + printArea.height

  obj.setCoords()
  let bounds = obj.getBoundingRect(true, true)

  if(bounds.width > printArea.width || bounds.height > printArea.height){
    const scaleFactor = Math.min(printArea.width / bounds.width, printArea.height / bounds.height, 1)
    obj.scale(obj.scaleX * scaleFactor)
    obj.setCoords()
    bounds = obj.getBoundingRect(true, true)
  }

  let deltaX = 0
  let deltaY = 0

  if(bounds.left < areaLeft){
    deltaX = areaLeft - bounds.left
  }
  if(bounds.left + bounds.width > areaRight){
    deltaX = areaRight - (bounds.left + bounds.width)
  }
  if(bounds.top < areaTop){
    deltaY = areaTop - bounds.top
  }
  if(bounds.top + bounds.height > areaBottom){
    deltaY = areaBottom - (bounds.top + bounds.height)
  }

  if(deltaX || deltaY){
    obj.set({
      left: obj.left + deltaX,
      top: obj.top + deltaY
    })
    obj.setCoords()
  }

  studioCanvas.value?.requestRenderAll()
  isConstraining = false
}

function applyMockupColor(){
  if(!mockupImage.value) return
  const strength = Math.min(Math.max(mockupTintStrength.value / 100, 0), 1)
  const center = mockupImage.value.getCenterPoint()
  const width = mockupImage.value.getScaledWidth()
  const height = mockupImage.value.getScaledHeight()

  if(!mockupTintLayer.value){
    mockupTintLayer.value = new Rect({
      left: center.x,
      top: center.y,
      originX: "center",
      originY: "center",
      width,
      height,
      angle: mockupImage.value.angle || 0,
      fill: mockupColor.value,
      opacity: strength,
      selectable: false,
      evented: false,
      globalCompositeOperation: "multiply",
      data: { role: "tint" }
    })
    studioCanvas.value.add(mockupTintLayer.value)
  }else{
    mockupTintLayer.value.set({
      left: center.x,
      top: center.y,
      width,
      height,
      angle: mockupImage.value.angle || 0,
      fill: mockupColor.value,
      opacity: strength
    })
  }

  if(mockupImage.value){
    studioCanvas.value.sendToBack(mockupImage.value)
  }
  if(mockupTintLayer.value){
    studioCanvas.value.sendToBack(mockupTintLayer.value)
    studioCanvas.value.bringForward(mockupTintLayer.value)
  }
  if(printAreaOutline.value){
    printAreaOutline.value.bringToFront()
  }
  studioCanvas.value.requestRenderAll()
}

function setMockupOrientation(orientation){
  mockupOrientation.value = orientation
  updatePrintArea()
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

.upload-form{
  display:flex;
  flex-direction:column;
  gap:8px;
}

.tool-section label{
  display:flex;
  flex-direction:column;
  gap:6px;
  color:#ddd;
  font-size:0.9rem;
}

.tool-section input[type="color"],
.tool-section input[type="range"],
.tool-section input[type="file"],
.tool-section input[type="text"]{
  width:100%;
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

.tool-grid button.active{
  background:#ff6b00;
  color:#111;
}

.muted{
color:#aaa;
}

@media (max-width: 900px){
  .canvas-stage{
    max-height:65vh;
  }
}

@media (max-width: 600px){
  .canvas-stage{
    padding:6px;
    aspect-ratio:4 / 5;
  }
}

</style>
