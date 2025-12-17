<template>
  <div>
    <!-- Floating Draggable Chat Icon -->
    <div 
      v-if="!isOpen" 
      class="chat-bubble" 
      :style="{ top: bubblePos.top + 'px', left: bubblePos.left + 'px' }"
      @mousedown="startBubbleDrag"
    >
      <div class="bubble-icon" @click="toggleChat">💬</div>
    </div>

    <!-- Chat Window -->
    <transition name="fade-scale">
      <div 
        v-if="isOpen" 
        class="chatbot-window"
        :style="{ top: position.top + 'px', left: position.left + 'px' }"
        @mousedown="startDrag"
      >
        <div class="chatbot-header" @mousedown.stop="startDrag">
          <h4>O!clok Assistant</h4>
          <button class="close-btn" @click="toggleChat">–</button>
        </div>

        <div class="chatbot-messages" ref="messages">
          <div 
            v-for="(msg, idx) in messages" 
            :key="idx" 
            :class="['message', msg.sender]"
          >
            {{ msg.text }}
          </div>
        </div>

        <div class="chatbot-input">
          <input 
            type="text" 
            v-model="userInput" 
            placeholder="Ask me something..." 
            @input="generateSuggestions(userInput)"
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage">➤</button>
        </div>

        <!-- FAQ Suggestions -->
        <ul 
          v-if="suggestions.length && userInput.length > 1" 
          class="suggestion-box"
        >
          <li 
            v-for="(s, i) in suggestions" 
            :key="i" 
            @click="applySuggestion(s.question)"
          >
            {{ s.question }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "ChatBot",

  data() {
    return {
      isOpen: false,
      userInput: "",
      suggestions: [],
      messages: [
        { sender: "bot", text: "Hey 👋, how can I help you today?" }
      ],

      /* FAQ DATA (from your FAQ component) */
      faqData: [
        {
          title: "Ordering",
          items: [
            { question: "How do I place an order?", answer: "Browse products, add to cart, and proceed to checkout." },
            { question: "What payment methods are supported?", answer: "We accept M-Pesa, Airtel Money, Visa, Mastercard, and bank transfers." },
            { question: "Can I change or cancel my order after placing it?", answer: "Yes, if the order hasn’t been dispatched yet. Contact support immediately." },
          ],
        },
        {
          title: "Delivery",
          items: [
            { question: "How do I track my delivery?", answer: "A tracking link will be sent via SMS or email once shipped." },
            { question: "Do you deliver outside Nairobi or Kisumu?", answer: "Yes, we deliver across Kenya including Eldoret, Vihiga, and Mombasa." },
            { question: "Where can I get a reliable technician?", answer: "Use our 'Book a Technician' feature to find certified professionals." },
          ],
        },
        {
          title: "Support & Returns",
          items: [
            { question: "Do you offer returns or refunds?", answer: "Yes, within 7 days. Refunds process in 3–5 business days." },
            { question: "What if I receive the wrong product?", answer: "Send a photo and order number. We’ll replace or refund." },
            { question: "Is there a warranty on products?", answer: "Most electronics include a manufacturer's warranty." },
          ],
        },
        {
          title: "Account & Security",
          items: [
            { question: "How do I reset my password?", answer: "Click 'Forgot Password' on the login page." },
            { question: "Is my personal data safe?", answer: "Yes, we use encrypted servers and strict privacy controls." },
          ],
        },
        {
          title: "Product Information",
          items: [
            { question: "How do I know if a product is in stock?", answer: "If the product shows an 'Add to Cart' button, it is available." },
            { question: "Can I request a product that's not listed?", answer: "Yes, contact us via WhatsApp or the contact form." },
          ],
        },
      ],

      /* draggable settings */
      position: { top: window.innerHeight - 480, left: window.innerWidth - 360 },
      bubblePos: { top: window.innerHeight - 90, left: window.innerWidth - 90 },
      drag: { active: false, offsetX: 0, offsetY: 0 },
      bubbleDrag: { active: false, offsetX: 0, offsetY: 0 },
    };
  },

  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
    },

    sendMessage() {
      if (!this.userInput.trim()) return;

      const text = this.userInput;
      this.messages.push({ sender: "user", text });

      const reply = this.findFAQResponse(text.toLowerCase());

      setTimeout(() => {
        this.messages.push({ sender: "bot", text: reply });
        this.scrollToBottom();
      }, 600);

      this.userInput = "";
      this.suggestions = [];
      this.scrollToBottom();
    },

    /* ===========================
       SMART FAQ MATCHING LOGIC
    ============================*/
    findFAQResponse(input) {
      const allFAQs = this.faqData.flatMap(cat => cat.items);

      // direct match by first word or keyword
      for (let item of allFAQs) {
        const q = item.question.toLowerCase();

        // first word match
        if (input.includes(q.split(" ")[0])) return item.answer;

        // match long keywords (>= 4 letters)
        const keywords = q.split(" ").filter(k => k.length >= 4);
        if (keywords.some(k => input.includes(k))) return item.answer;
      }

      // fallback replies
      if (input.includes("services")) return "We provide creative and innovative digital solutions.";
      if (input.includes("contact")) return "You can contact us via the Contact page or social media.";
      if (input.includes("price") || input.includes("cost")) return "Pricing depends on project details.";

      return "I'm not fully sure 🤔 — but you can ask about orders, delivery, payments, technicians, warranty, or returns.";
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messages;
        if (container) container.scrollTop = container.scrollHeight;
      });
    },

    /* ===========================
          DRAGGABLE WINDOW
    ============================*/
    startDrag(e) {
      this.drag.active = true;
      this.drag.offsetX = e.clientX - this.position.left;
      this.drag.offsetY = e.clientY - this.position.top;

      document.addEventListener("mousemove", this.onDrag);
      document.addEventListener("mouseup", this.stopDrag);
    },

    onDrag(e) {
      if (!this.drag.active) return;

      this.position.left = Math.min(
        window.innerWidth - 320,
        Math.max(0, e.clientX - this.drag.offsetX)
      );

      this.position.top = Math.min(
        window.innerHeight - 100,
        Math.max(0, e.clientY - this.drag.offsetY)
      );
    },

    stopDrag() {
      this.drag.active = false;
      document.removeEventListener("mousemove", this.onDrag);
      document.removeEventListener("mouseup", this.stopDrag);
    },

    /* ===========================
         DRAGGABLE BUBBLE
    ============================*/
    startBubbleDrag(e) {
      this.bubbleDrag.active = true;
      this.bubbleDrag.offsetX = e.clientX - this.bubblePos.left;
      this.bubbleDrag.offsetY = e.clientY - this.bubblePos.top;

      document.addEventListener("mousemove", this.onBubbleDrag);
      document.addEventListener("mouseup", this.stopBubbleDrag);
    },

    onBubbleDrag(e) {
      if (!this.bubbleDrag.active) return;

      this.bubblePos.left = Math.min(
        window.innerWidth - 70,
        Math.max(0, e.clientX - this.bubbleDrag.offsetX)
      );

      this.bubblePos.top = Math.min(
        window.innerHeight - 70,
        Math.max(0, e.clientY - this.bubbleDrag.offsetY)
      );
    },

    stopBubbleDrag() {
      this.bubbleDrag.active = false;
      document.removeEventListener("mousemove", this.onBubbleDrag);
      document.removeEventListener("mouseup", this.stopBubbleDrag);
    },

    /* ===========================
            SUGGESTIONS
    ============================*/
    generateSuggestions(input) {
      const txt = input.toLowerCase().trim();
      if (!txt) {
        this.suggestions = [];
        return;
      }

      const allFAQs = this.faqData.flatMap(cat => cat.items);

      this.suggestions = allFAQs
        .filter(item => item.question.toLowerCase().includes(txt))
        .slice(0, 5);
    },

    applySuggestion(q) {
      this.userInput = q;
      this.suggestions = [];
      this.sendMessage();
    }
  }
};
</script>

<style scoped>
.suggestion-box {
  position: absolute;
  bottom: 55px;
  left: 10px;
  right: 10px;
  background: white;
  border-radius: 8px;
  max-height: 180px;
  overflow-y: auto;
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 20;
}

.suggestion-box li {
  padding: 10px 14px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.suggestion-box li:hover {
  background: #f7f7f7;
}
</style>
