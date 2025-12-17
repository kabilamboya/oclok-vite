methods: {
  downloadMockup() {
    const canvasData = this.canvas.toDataURL("image/png");

    // Add to cart
    this.$emit("add-to-cart", {
      id: Date.now(),
      title: "Custom Mockup",
      price: 350, // or dynamic
      isMockup: true,
      canvasDataUrl: canvasData,
      thumbnail: canvasData
    });

    alert("Mockup added to cart!");
  }
}
