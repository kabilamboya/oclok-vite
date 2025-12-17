methods: {
  async exportPDF() {
    const pdf = new jsPDF("p", "pt", "a4");
    const element = document.querySelector(".writer");
    const canvas = await html2canvas(element);
    const img = canvas.toDataURL("image/png");

    pdf.addImage(img, "PNG", 15, 15, 565, 800);

    const pdfFile = pdf.output("datauristring");

    // Add to cart with thumbnail
    this.$emit("add-to-cart", {
      id: Date.now(),
      title: "Custom PDF",
      price: 200, // or dynamic
      file: pdfFile,
      thumbnail: img
    });

    alert("PDF added to cart!");
  }
}
