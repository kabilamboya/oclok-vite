<template>
  <div>
    <!-- Floating Chat Button (only visible when chat is closed) -->
      <button 
        v-if="!isOpen" 
        class="chatbot-btn" 
        @click="toggleChat"
      >
        <!-- Try to load logo, fallback to emoji if error -->
        <img 
          src="/images/oclokLogo.png" 
          alt="Chat Logo" 
          @error="logoError = true" 
          v-if="!logoError"
        />
        <span v-else>💬</span>
      </button>

    <!-- Chat Window -->
    <div 
      v-if="isOpen" 
      class="chatbot-window" 
      :style="{ top: position.top + 'px', left: position.left + 'px' }"
      @mousedown="startDrag"
    >
      <div class="chatbot-header" @mousedown.stop="startDrag">
        <h4>O!clok Assistant</h4>
        <button class="close-btn" @click="toggleChat">×</button>
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
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage">➤</button>
      </div>
    </div>
  </div>
</template>

  <script setup>
  import { ref } from 'vue'

  const isOpen = ref(false)
  const logoError = ref(false)

  const toggleChat = () => {
    isOpen.value = !isOpen.value
  }
  </script>

<script>
export default {
  name: "ChatBot",
  data() {
    return {
      isOpen: false,
      userInput: "",
      messages: [
        { sender: "bot", text: "Hi 👋, I’m your guide. Ask me anything about our services!" }
      ],
      position: { top: window.innerHeight - 500, left: window.innerWidth - 360 }, // starting pos
      drag: { active: false, offsetX: 0, offsetY: 0 }
    };
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
    },
    sendMessage() {
      if (!this.userInput.trim()) return;
      this.messages.push({ sender: "user", text: this.userInput });

      let reply = this.getBotResponse(this.userInput);
      setTimeout(() => {
        this.messages.push({ sender: "bot", text: reply });
        this.scrollToBottom();
      }, 600);

      this.userInput = "";
      this.scrollToBottom();
    },
    getBotResponse(input) {
      input = input.toLowerCase();
      if (input.includes("services")) return "We offer smart solutions, creative design, and innovations tailored for you.";
      if (input.includes("contact")) return "You can reach us via the Contact page or social media links in the footer.";
      if (input.includes("price")) return "Pricing depends on your project needs. Would you like me to connect you with sales?";
      return "I'm not sure, but I’ll learn 🤔. Try asking about 'services', 'contact', or 'pricing'.";
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const box = this.$refs.messages;
        box.scrollTop = box.scrollHeight;
      });
    },
    // Dragging
    startDrag(e) {
      this.drag.active = true;
      this.drag.offsetX = e.clientX - this.position.left;
      this.drag.offsetY = e.clientY - this.position.top;

      document.addEventListener("mousemove", this.onDrag);
      document.addEventListener("mouseup", this.stopDrag);
    },
    onDrag(e) {
      if (this.drag.active) {
        this.position.left = e.clientX - this.drag.offsetX;
        this.position.top = e.clientY - this.drag.offsetY;
      }
    },
    stopDrag() {
      this.drag.active = false;
      document.removeEventListener("mousemove", this.onDrag);
      document.removeEventListener("mouseup", this.stopDrag);
    }
  }
};
</script>

<style scoped>
/* Floating Button */
.chatbot-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #3eb489; /* mint color */
  color: white;
  border: none;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: 0.3s;
  z-index: 1000;
}
.chatbot-btn:hover {
  background: #34a67e;
}

/* Chat Window */
.chatbot-window {
  position: fixed;
  width: 320px;
  height: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  user-select: none;
  transition: transform 0.2s ease-in-out;
}

/* Header */
.chatbot-header {
  background: #3eb489; /* mint */
  color: white;
  padding: 0.7rem 1rem;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
}
.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.4rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.close-btn:hover {
  transform: scale(1.2);
}

/* Messages */
.chatbot-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  font-size: 0.9rem;
}
.message {
  margin-bottom: 0.8rem;
  padding: 0.6rem 0.9rem;
  border-radius: 10px;
  max-width: 80%;
  line-height: 1.3;
}
.message.bot {
  background: #f1f1f1;
  text-align: left;
}
.message.user {
  background: #3eb489;
  color: white;
  text-align: right;
  margin-left: auto;
}

/* Input Area */
.chatbot-input {
  display: flex;
  border-top: 1px solid #ddd;
}
.chatbot-input input {
  flex: 1;
  border: none;
  padding: 0.7rem;
  font-size: 0.9rem;
  outline: none;
}
.chatbot-input button {
  border: none;
  background: #3eb489;
  color: white;
  padding: 0.7rem 1rem;
  cursor: pointer;
}
.chatbot-input button:hover {
  background: #34a67e;
}
</style>
