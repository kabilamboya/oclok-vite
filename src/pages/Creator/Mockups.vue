<template>
  <section class="mockups-wrapper">
    <RteLayout :zoom="zoom" columns="1fr" aside-position="left">
      <template #toolbar>
        <CreatorToolbar
          :initial-zoom="zoom"
          current-page="mockups"
          @zoom-change="handleZoomChange"
          @tool-selected="selectedTool = $event"
          @delete-element="removeSelectedLayer"
        />
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

          <!-- Canvas & Controls -->
          <div class="workspace-grid">
            <div class="canvas-stage">
              <canvas ref="canvasElement" width="900" height="800"></canvas>
            </div>

            <!-- Controls Grid -->
            <div class="controls-container">
              <!-- Mockup Templates -->
              <ToolSection title="Mockup Templates">
                <div class="mockup-gallery">
                  <button 
                    v-for="mockup in availableMockups" 
                    :key="mockup.name"
                    :class="['mockup-button', { active: selectedMockup === mockup.name }]"
                    @click="loadMockup(mockup.name)"
                    :title="`Load ${mockup.name}`"
                  >
                    <img :src="mockup.path" :alt="mockup.name" class="mockup-thumbnail" />
                    <span class="mockup-label">{{ mockup.label }}</span>
                  </button>
                </div>
              </ToolSection>

              <!-- Upload -->
              <ToolSection title="Upload Design">
                <form class="upload-form" @submit.prevent="onUpload">
                  <input v-model="form.name" placeholder="Name" required>
                  <input type="file" accept="image/*" @change="onFileChange">
                  <button type="submit">Upload</button>
                </form>
              </ToolSection>

              <!-- Mockup Settings -->
              <ToolSection title="Mockup Settings">
                <ColorPicker 
                  v-model="mockupColor"
                  label="Mockup Color"
                  :presets="COLOR_PRESETS"
                  @update:modelValue="applyMockupColor"
                />
                <ControlSlider 
                  v-model="mockupTintStrength"
                  label="Tint Strength"
                  min="0"
                  max="100"
                  @update:modelValue="applyMockupColor"
                />
                <div class="tool-grid">
                  <button :class="{ active: mockupOrientation === 'portrait' }" @click="setMockupOrientation('portrait')">
                    Portrait
                  </button>
                  <button :class="{ active: mockupOrientation === 'landscape' }" @click="setMockupOrientation('landscape')">
                    Landscape
                  </button>
                </div>
              </ToolSection>

              <!-- Design Controls -->
              <ToolSection title="Design">
                <div class="tool-grid">
                  <button @click="fitDesignToPrintArea">Fit to Area</button>
                  <button @click="centerDesignInPrintArea">Center</button>
                  <button @click="removeDesignImage">Remove</button>
                </div>
              </ToolSection>

              <!-- Shape Tools -->
              <ToolSection title="Add Shapes">
                <ShapesLibrary 
                  :shapes="SHAPES_LIBRARY"
                  @shape-selected="handleShapeSelected"
                />
              </ToolSection>

              <!-- Shape Colors -->
              <ToolSection title="Shape Colors">
                <ColorPicker 
                  v-model="shapeColors.rect"
                  label="Rectangle Color"
                  :presets="COLOR_PRESETS"
                />
                <ColorPicker 
                  v-model="shapeColors.circle"
                  label="Circle Color"
                  :presets="COLOR_PRESETS"
                />
              </ToolSection>

              <!-- Brush Tools -->
              <ToolSection title="Brush">
                <div class="tool-grid">
                  <button @click="toggleDrawingMode" :class="{ active: drawingMode }">Draw</button>
                  <button @click="clearCanvasObjects">Clear</button>
                </div>
                <ControlSlider 
                  v-model="brushSize"
                  label="Size"
                  min="1"
                  max="48"
                />
                <ColorPicker 
                  v-model="brushColor"
                  label="Brush Color"
                  :presets="COLOR_PRESETS"
                />
              </ToolSection>

              <!-- Element Color -->
              <ToolSection title="Element Color">
                <ColorPicker 
                  v-model="elementColor"
                  label="Fill Color"
                  :presets="COLOR_PRESETS"
                  @update:modelValue="applyElementColor"
                />
              </ToolSection>

              <!-- Layer Controls -->
              <ToolSection title="Layer Controls">
                <ControlSlider 
                  v-model="layerControls.opacity"
                  label="Opacity"
                  min="10"
                  max="100"
                  @update:modelValue="applyLayerControls"
                />
                <ControlSlider 
                  v-model="layerControls.scale"
                  label="Scale"
                  min="20"
                  max="220"
                  @update:modelValue="applyLayerControls"
                />
                <ControlSlider 
                  v-model="layerControls.angle"
                  label="Rotate"
                  min="-180"
                  max="180"
                  @update:modelValue="applyLayerControls"
                />
              </ToolSection>

              <!-- Delete -->
              <ToolSection title="Actions">
                <button class="delete-btn" @click="removeSelectedLayer">Delete Selected</button>
              </ToolSection>
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
import ToolSection from "@/components/ToolSection.vue"
import ColorPicker from "@/components/ColorPicker.vue"
import ControlSlider from "@/components/ControlSlider.vue"
import ShapesLibrary from "@/components/ShapesLibrary.vue"

import { SHAPES_LIBRARY, COLOR_PRESETS, DEFAULT_SHAPE_COLORS, MOCKUP_TEMPLATES } from "@/lib/shapes-library.js"

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

const availableMockups = MOCKUP_TEMPLATES
const selectedMockup = ref('tshirt')

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
  rect: DEFAULT_SHAPE_COLORS.rect,
  circle: DEFAULT_SHAPE_COLORS.circle
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

function handleShapeSelected(shape) {
  // Call the appropriate handler based on the shape
  const handler = this[shape.handler]
  if (handler && typeof handler === 'function') {
    handler.call(this)
  }
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
  loadMockup('tshirt')
}

function loadMockup(mockupName){
  // Find the mockup
  const mockup = availableMockups.find(m => m.name === mockupName)
  if(!mockup) return
  
  selectedMockup.value = mockupName
  
  // Remove old mockup and tint layers
  if(mockupImage.value){
    studioCanvas.value.remove(mockupImage.value)
    mockupImage.value = null
  }
  if(mockupTintLayer.value){
    studioCanvas.value.remove(mockupTintLayer.value)
    mockupTintLayer.value = null
  }
  
  // Load new mockup
  FabricImage.fromURL(mockup.path).then((img)=>{
    img.scaleToWidth(520)
    const canvasWidth = canvasElement.value?.width || 1280
    const canvasHeight = canvasElement.value?.height || 1440
    img.set({
      originX: "center",
      originY: "center",
      left: canvasWidth / 2,
      top: canvasHeight / 2,
      selectable: false,
      evented: false,
      data: { role: "mockup" }
    })
    mockupImage.value = img
    studioCanvas.value.add(img)
    updatePrintArea()
    applyMockupColor()
    studioCanvas.value.renderAll()
  }).catch((err)=>{
    console.error(`Error loading mockup ${mockupName}:`, err)
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
  
  isConstraining = true

  const obj = designImage.value
  // Allow placement anywhere on canvas
  const canvasWidth = studioCanvas.value?.width || 1280
  const canvasHeight = studioCanvas.value?.height || 1440
  const canvasLeft = 0
  const canvasTop = 0
  const canvasRight = canvasWidth
  const canvasBottom = canvasHeight

  obj.setCoords()
  let bounds = obj.getBoundingRect(true, true)

  // Keep object within canvas bounds
  if(bounds.width > canvasWidth || bounds.height > canvasHeight){
    const scaleFactor = Math.min(canvasWidth / bounds.width, canvasHeight / bounds.height, 1)
    obj.scale(obj.scaleX * scaleFactor)
    obj.setCoords()
    bounds = obj.getBoundingRect(true, true)
  }

  let deltaX = 0
  let deltaY = 0

  if(bounds.left < canvasLeft){
    deltaX = canvasLeft - bounds.left
  }
  if(bounds.left + bounds.width > canvasRight){
    deltaX = canvasRight - (bounds.left + bounds.width)
  }
  if(bounds.top < canvasTop){
    deltaY = canvasTop - bounds.top
  }
  if(bounds.top + bounds.height > canvasBottom){
    deltaY = canvasBottom - (bounds.top + bounds.height)
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
  overflow:hidden;
}

.workspace-panel{
  background:#151515;
  padding:1rem;
  border-radius:10px;
  display:flex;
  flex-direction:column;
  height:100%;
  overflow-y:auto;
  overflow-x:hidden;
}

.header-row{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:1rem;
}

.header-actions{
  display:flex;
  gap:8px;
}

.workspace-grid{
  display:flex;
  flex-wrap:wrap;
  gap:2rem;
  align-items:flex-start;
  margin-bottom:1rem;
}

.canvas-stage{
  border:1px solid #333;
  background:#000;
  padding:8px;
  border-radius:6px;
  flex-shrink:0;
}

canvas{
  display:block;
  max-width:100%;
  height:auto;
}

.controls-container{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));
  gap:1.5rem;
  flex:1;
  min-width:250px;
}

.tool-grid{
  display:grid;
  grid-template-columns:repeat(2, 1fr);
  gap:0.75rem;
}

.tool-grid button{
  padding:0.75rem;
  background:#0d0d0d;
  border:1px solid #333;
  border-radius:6px;
  color:#d0d0d0;
  font-weight:500;
  cursor:pointer;
  transition:all 0.2s ease;
}

.tool-grid button:hover{
  background:#1a1a1a;
  border-color:#ffd600;
  color:#ffd600;
}

.tool-grid button.active{
  background:#ffd600;
  border-color:#ffd600;
  color:#000;
}

.mockup-gallery{
  display:grid;
  grid-template-columns:repeat(2, 1fr);
  gap:0.75rem;
}

.mockup-button{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:0.5rem;
  padding:0.75rem;
  background:#0d0d0d;
  border:2px solid #333;
  border-radius:6px;
  color:#d0d0d0;
  cursor:pointer;
  transition:all 0.2s ease;
}

.mockup-button:hover{
  background:#1a1a1a;
  border-color:#ffd600;
}

.mockup-button.active{
  background:#ffd600;
  border-color:#ffd600;
  color:#000;
}

.mockup-thumbnail{
  width:100%;
  height:auto;
  max-width:80px;
  object-fit:contain;
}

.mockup-label{
  font-size:0.8rem;
  font-weight:600;
  text-transform:uppercase;
}

.upload-form{
  display:flex;
  flex-direction:column;
  gap:0.75rem;
}

.upload-form input[type="text"],
.upload-form input[type="file"]{
  padding:0.6rem;
  background:#0d0d0d;
  border:1px solid #333;
  border-radius:4px;
  color:#d0d0d0;
  font-size:0.9rem;
}

.upload-form button{
  padding:0.6rem;
  background:#ffd600;
  border:none;
  border-radius:4px;
  color:#000;
  font-weight:600;
  cursor:pointer;
  transition:all 0.2s ease;
}

.upload-form button:hover{
  background:#ffed4e;
}

.delete-btn{
  width:100%;
  padding:0.75rem;
  background:#dc3545;
  border:none;
  border-radius:6px;
  color:#fff;
  font-weight:600;
  cursor:pointer;
  transition:all 0.2s ease;
}

.delete-btn:hover{
  background:#ef5350;
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

.upload-form{
  display:flex;
  flex-direction:column;
  gap:8px;
}

.tool-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:6px;
}

.mockup-gallery{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
  margin-bottom:12px;
}

.mockup-button{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:6px;
  background:#222;
  border:2px solid #444;
  padding:8px;
  border-radius:6px;
  cursor:pointer;
  transition:all 0.2s ease;
}

.mockup-button:hover{
  border-color:#666;
}

.mockup-button.active{
  background:#ffd600;
  border-color:#ffd600;
  color:#111;
}

.mockup-thumbnail{
  width:60px;
  height:60px;
  object-fit:contain;
  background:#111;
  padding:4px;
  border-radius:4px;
}

.mockup-button.active .mockup-thumbnail{
  background:#ddd;
}

.mockup-label{
  font-size:0.8rem;
  font-weight:500;
  text-align:center;
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
  font-size:0.85rem;
}

@media (max-width: 768px){
  .workspace-panel{
    padding:0.75rem;
  }
  
  .controls-container{
    grid-template-columns:1fr;
  }
}

@media (max-width: 600px){
  canvas{
    max-width:100%;
  }
}

</style>
