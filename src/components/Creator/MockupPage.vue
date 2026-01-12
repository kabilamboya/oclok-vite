<template>
  <div class="card">
    <h2>Product Mockup Generator</h2>

    <input type="file" accept="image/*" @change="uploadImage" />

    <select v-model="selectedMockup" @change="loadMockup">
      <option disabled value="">Choose mockup</option>
      <option value="/mockups/tshirt.png">T-Shirt</option>
      <option value="/mockups/mug.png">Mug</option>
    </select>

    <canvas id="mockupCanvas" width="600" height="600"></canvas>

    <button class="btn primary" @click="exportMockup">
      Download Mockup & Add to Cart
    </button>
  </div>
</template>

<script>
import * as fabric from "fabric";

export default {
  name: "Mockup",

  data() {
    return {
      canvas: null,
      selectedMockup: ""
    };
  },

  mounted() {
    this.canvas = new fabric.Canvas("mockupCanvas");
  },

  methods: {
    uploadImage(e) {
      const file = e.target.files[0];
      if (!file) return;

      fabric.Image.fromURL(URL.createObjectURL(file), img => {
        img.scaleToWidth(300);
        this.canvas.add(img);
      });
    },

    loadMockup() {
      if (!this.selectedMockup) return;

      this.canvas.clear();

      fabric.Image.fromURL(this.selectedMockup, img => {
        img.selectable = false;
        this.canvas.add(img);
        this.canvas.sendToBack(img);
      });
    },

    exportMockup() {
      const data = this.canvas.toDataURL("image/png");

      this.$emit("add-to-cart", {
        id: Date.now(),
        type: "mockup",
        title: "Custom Mockup",
        price: 350,
        file: data,
        thumbnail: data
      });
    }
  }
};
</script>
