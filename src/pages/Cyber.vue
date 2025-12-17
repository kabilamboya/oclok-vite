<template>
  <section class="creator-wrapper">

    <!-- Page Title -->
    <h1 class="title">Convenience. Essence. Value</h1>

    <!-- Tabs -->
    <div class="tabs">
      <button
        :class="['tab', activeTab === 'writer' ? 'active' : '']"
        @click="switchTab('writer')"
      >
        ✍️ Writer
      </button>

      <button
        :class="['tab', activeTab === 'mockup' ? 'active' : '']"
        @click="switchTab('mockup')"
      >
        🎨 Mockup Studio
      </button>

      <button class="open-gallery-btn" @click="$router.push('/gallery')">
        🎨 Open Design Gallery
      </button>
    </div>

    <!-- WRITER -->
    <div v-if="activeTab === 'writer'" class="card">
      <h2>Handwriting / Text to PDF</h2>

      <div class="editor-box">
        <QuillEditor v-model="content" :options="editorOptions" theme="snow" />
      </div>

      <label class="upload-label">Upload Handwritten Image</label>
      <input type="file" accept="image/*" @change="handleImage" class="file-input"/>

      <div v-if="preview" class="preview-box">
        <img :src="preview" />
      </div>

      <button class="btn primary" @click="downloadPDFAndAddToCart">
        Download PDF & Add to Cart
      </button>
    </div>

    <!-- MOCKUP -->
    <div v-if="activeTab === 'mockup'" class="card">
      <h2>Product Mockup Generator</h2>

      <label class="upload-label">Upload Your Image</label>
      <input type="file" accept="image/*" @change="uploadMockupImage" class="file-input"/>

      <label class="upload-label">Select Mockup Template</label>
      <select v-model="selectedMockup" @change="loadMockup" class="select-input">
        <option disabled value="">Choose mockup</option>
        <option value="mockups/tshirt.png">T-shirt</option>
        <option value="mockups/mug.png">Mug</option>
        <option value="mockups/umbrella.png">Umbrella</option>
        <option value="mockups/billboard.png">Billboard</option>
        <option value="mockups/book.png">Book</option>
      </select>

      <canvas id="mockupCanvas" width="600" height="600" class="mockup-canvas"></canvas>

      <button class="btn primary" @click="downloadMockupAndAddToCart">
        Download Mockup & Add to Cart
      </button>
    </div>
  </section>

  
    <!-- Poster Gallery -->
  <section class="poster-gallery">
  <h2>Media Gallery</h2>

  <div class="gallery-grid">
    <div
      v-for="item in galleryItems"
      :key="item.id"
      class="gallery-item"
    >
      <img :src="item.image" :alt="'Poster ' + item.id" />
    </div>
  </div>
  </section>
</template>

<script>
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import * as fabric from "fabric";

import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  name: "CreatorPage",
  components: { QuillEditor },

  data() {
    return {
      activeTab: "writer",

      // Writer
      content: "",
      preview: null,
      editorOptions: {
        placeholder: "Type or paste your content here..."
      },

      // Mockup
      canvas: null,
      selectedMockup: "",

    galleryItems:[
      { id: 1, image: "/images/RANA.jpg" }
    ]
    };
  },

  watch: {
    activeTab(newVal) {
      if (newVal === "mockup") {
        this.$nextTick(() => {
          if (!this.canvas) {
            this.canvas = new fabric.Canvas("mockupCanvas");
          }
        });
      }
    }
  },

  mounted() {
    // Initialize writer tab first only
  },

  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    },

    // ====================== WRITER ======================
    handleImage(e) {
      const file = e.target.files[0];
      this.preview = URL.createObjectURL(file);
    },

    async downloadPDFAndAddToCart() {
      try {
        const element = document.querySelector(".writer");

        const canvas = await html2canvas(element, {
          useCORS: true,
          scale: 2
        });

        const img = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "pt", "a4");

        pdf.addImage(img, "PNG", 15, 15, 565, 800);
        pdf.save("document.pdf");

        const product = {
          id: Date.now(),
          title: "Custom PDF",
          image: img,
          price: 500,
          quantity: 1
        };

        this.$emit("add-to-cart", product);
      } catch (err) {
        console.error("PDF Error:", err);
      }
    },

    // ====================== MOCKUP ======================
    uploadMockupImage(e) {
      const file = e.target.files[0];
      if (!file) return;

      const url = URL.createObjectURL(file);

      fabric.Image.fromURL(url, img => {
        img.scaleToWidth(300);
        img.top = 150;
        img.left = 150;
        img.cornerStyle = "circle";
        img.transparentCorners = false;

        this.canvas.add(img);
        this.canvas.setActiveObject(img);
      });
    },

    loadMockup() {
      if (!this.canvas) return;

      this.canvas.clear();

      if (!this.selectedMockup) return;

      fabric.Image.fromURL(this.selectedMockup, img => {
        img.selectable = false;
        img.evented = false;
        this.canvas.add(img);
        this.canvas.sendToBack(img);
      });
    },

    downloadMockupAndAddToCart() {
      if (!this.canvas) return;

      const url = this.canvas.toDataURL("image/png");

      // Download
      const a = document.createElement("a");
      a.href = url;
      a.download = "mockup.png";
      a.click();

      const product = {
        id: Date.now(),
        title: `Custom ${
          this.selectedMockup
            ? this.selectedMockup.split("/").pop().split(".")[0]
            : "Mockup"
        }`,
        image: url,
        price: 1200,
        quantity: 1
      };

      this.$emit("add-to-cart", product);
    }
  }
};
</script>

<style scoped>
.creator-wrapper {
  width: 90%;
  margin: auto;
  padding: 30px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab {
  padding: 12px 20px;
  border: 1px solid #444;
  background: #eee;
  cursor: pointer;
  border-radius: 6px;
}

.tab.active {
  background: #333;
  color: white;
}

.open-gallery-btn {
  background: #3b82f6;
  color: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.25s;
}
.open-gallery-btn:hover {
  background: #2563eb;
}

/* Editor */
.editor-box {
  margin-bottom: 20px;
  background: white;
  border-radius: 6px;
  padding: 10px;
}

.upload-label {
  display: block;
  margin-top: 20px;
  font-weight: bold;
}

.preview-box img {
  max-width: 300px;
  margin: 10px 0;
  border-radius: 6px;
}

.btn {
  margin-top: 20px;
  padding: 10px 20px;
  background: #222;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn:hover {
  background: #444;
}

canvas {
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.creator-wrapper {
  width: 90%;
  margin: auto;
  padding: 30px;
  max-width: 1100px;
  font-family: "Inter", sans-serif;
}

/* Tabs */
.tabs {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.tab {
  padding: 12px 22px;
  background: #f3f4f6;
  color: #444;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.tab:hover {
  background: #e5e7eb;
}

.tab.active {
  background: #2563eb;
  color: white;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
}

/* Gallery Button */
.open-gallery-btn {
  margin-left: auto;
  background: #10b981;
  color: #fff;
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
  box-shadow: 0 3px 5px rgba(0,0,0,0.1);
}

.open-gallery-btn:hover {
  background: #059669;
}

/* Card Layout */
.card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  margin-bottom: 40px;
}

.card h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #111827;
}

/* Inputs */
.file-input,
.select-input {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 15px;
  background: #f9fafb;
  transition: 0.25s;
}

.file-input:hover,
.select-input:hover {
  border-color: #2563eb;
}

.file-input:focus,
.select-input:focus {
  outline: none;
  border-color: #2563eb;
  background: #ffffff;
}

/* Editor */
.editor-box {
  margin-bottom: 20px;
  padding: 15px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

/* Preview */
.preview-box img {
  max-width: 100%;
  margin-top: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

/* Buttons */
.btn {
  padding: 12px 22px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.25s;
}

.btn.primary {
  background: #1f2937;
  color: #fff;
}

.btn.primary:hover {
  background: #374151;
}

/* Canvas */
.mockup-canvas {
  margin-top: 25px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
}


.poster-gallery {
  margin: 3rem 0;
  text-align: center;
}

.poster-gallery h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
}

/* Desktop: 5 columns, 2 rows */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
}

.gallery-item img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
}

/* Tablet */
@media (max-width: 900px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Mobile */
@media (max-width: 600px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

</style>
