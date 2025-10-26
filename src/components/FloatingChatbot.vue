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
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage">➤</button>
        </div>
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
      messages: [
        { sender: "bot", text: "Hey 👋, how can I help you today?" }
      ],
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
      if (input.includes("services")) return "We provide creative, smart, and innovative solutions.";
      if (input.includes("contact")) return "You can reach us via the Contact page or social media links.";
      if (input.includes("price") || input.includes("cost")) return "Pricing depends on your project scope.";
      return "Hmm 🤔 I’m not sure — try asking about 'services', 'contact', or 'pricing'.";
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const box = this.$refs.messages;
        if (box) box.scrollTop = box.scrollHeight;
      });
    },
    // Draggable chat window
    startDrag(e) {
      this.drag.active = true;
      this.drag.offsetX = e.clientX - this.position.left;
      this.drag.offsetY = e.clientY - this.position.top;
      document.addEventListener("mousemove", this.onDrag);
      document.addEventListener("mouseup", this.stopDrag);
    },
    onDrag(e) {
      if (this.drag.active) {
        this.position.left = Math.min(
          window.innerWidth - 320,
          Math.max(0, e.clientX - this.drag.offsetX)
        );
        this.position.top = Math.min(
          window.innerHeight - 100,
          Math.max(0, e.clientY - this.drag.offsetY)
        );
      }
    },
    stopDrag() {
      this.drag.active = false;
      document.removeEventListener("mousemove", this.onDrag);
      document.removeEventListener("mouseup", this.stopDrag);
    },
    // Draggable chat icon
    startBubbleDrag(e) {
      this.bubbleDrag.active = true;
      this.bubbleDrag.offsetX = e.clientX - this.bubblePos.left;
      this.bubbleDrag.offsetY = e.clientY - this.bubblePos.top;
      document.addEventListener("mousemove", this.onBubbleDrag);
      document.addEventListener("mouseup", this.stopBubbleDrag);
    },
    onBubbleDrag(e) {
      if (this.bubbleDrag.active) {
        this.bubblePos.left = Math.min(
          window.innerWidth - 70,
          Math.max(0, e.clientX - this.bubbleDrag.offsetX)
        );
        this.bubblePos.top = Math.min(
          window.innerHeight - 70,
          Math.max(0, e.clientY - this.bubbleDrag.offsetY)
        );
      }
    },
    stopBubbleDrag() {
      this.bubbleDrag.active = false;
      document.removeEventListener("mousemove", this.onBubbleDrag);
      document.removeEventListener("mouseup", this.stopBubbleDrag);
    },
  }
};
</script>

<style scoped>
/* Chat bubble icon */
.chat-bubble {
  position: fixed;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #3eb489;
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  z-index: 9999;
  transition: transform 0.25s ease;
}
.chat-bubble:hover {
  transform: scale(1.1);
}
.bubble-icon {
  font-size: 28px;
  cursor: pointer;
}

/* Chat window */
.chatbot-window {
  position: fixed;
  width: 320px;
  height: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  z-index: 10000;
  user-select: none;
}

/* Header */
.chatbot-header {
  background: #3eb489;
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
  font-size: 1.3rem;
  cursor: pointer;
}
.close-btn:hover {
  transform: scale(1.3);
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

/* Input area */
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

/* Animations */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.25s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
