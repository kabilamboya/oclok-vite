<template>
  <div class="card writer">
    <h2>Handwriting / Text to PDF</h2>

    <div class="editor-box">
      <QuillEditor v-model="content" theme="snow" />
    </div>

    <input type="file" accept="image/*" @change="handleImage" />
    <img v-if="preview" :src="preview" class="preview" />

    <button class="btn primary" @click="exportPDF">
      Download PDF & Add to Cart
    </button>
  </div>
</template>

<script>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default {
  name: "Writer",

  components: { QuillEditor },

  data() {
    return {
      content: "",
      preview: null
    };
  },

  methods: {
    handleImage(e) {
      const file = e.target.files[0];
      if (file) this.preview = URL.createObjectURL(file);
    },

    async exportPDF() {
      const el = this.$el;
      const canvas = await html2canvas(el, { scale: 2 });
      const img = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      pdf.addImage(img, "PNG", 15, 15, 565, 800);

      this.$emit("add-to-cart", {
        id: Date.now(),
        type: "pdf",
        title: "Custom PDF",
        price: 200,
        file: pdf.output("datauristring"),
        thumbnail: img
      });
    }
  }
};
</script>
