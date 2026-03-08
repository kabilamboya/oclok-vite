<template>
  <div>
    <div
      v-if="!isOpen"
      class="chat-bubble"
      :style="{ top: bubblePos.top + 'px', left: bubblePos.left + 'px' }"
      @mousedown="startBubbleDrag"
    >
      <button type="button" class="bubble-icon" aria-label="Open chatbot" @click.stop="toggleChat">&#128172;</button>
    </div>

    <transition name="fade-scale">
      <div
        v-if="isOpen"
        class="chatbot-window"
        :style="{ top: position.top + 'px', left: position.left + 'px' }"
      >
        <div class="chatbot-header" @mousedown.stop="startDrag">
          <div class="header-copy">
            <h4>O!clok Assistant</h4>
            <small>Ask about services, products, delivery, and technicians</small>
          </div>
          <button type="button" class="close-btn" aria-label="Close chatbot" @click="toggleChat">-</button>
        </div>

        <div class="chatbot-messages" ref="messages">
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            :class="['message-row', msg.sender]"
          >
            <p class="message-author">{{ msg.sender === "bot" ? "O!clok Assistant" : "You" }}</p>
            <div :class="['message-bubble', msg.sender]">{{ msg.text }}</div>
            <div v-if="msg.references && msg.references.length" class="message-references">
              <span
                v-for="(ref, refIndex) in msg.references"
                :key="`${idx}-${refIndex}`"
                class="reference-pill"
              >
                {{ ref }}
              </span>
            </div>
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
          <button type="button" aria-label="Send message" @click="sendMessage">&#10148;</button>
        </div>

        <ul v-if="suggestions.length && userInput.length > 1" class="suggestion-box">
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
import servicesData from "../data/services.json";
import productsData from "../data/products.json";
import techniciansData from "../data/technicians.json";
import placesData from "../data/places.json";

export default {
  name: "FloatingChatbot",
  data() {
    return {
      isOpen: false,
      userInput: "",
      suggestions: [],
      services: servicesData,
      products: productsData,
      technicians: techniciansData,
      places: placesData,
      messages: [
        {
          sender: "bot",
          text: "Hey, how can I help you today?",
          references: ["FAQ Knowledge Base", "Service Catalog"],
        },
      ],
      faqData: [
        {
          title: "Ordering",
          items: [
            { question: "How do I place an order?", answer: "Browse products, add to cart, and proceed to checkout." },
            {
              question: "What payment methods are supported?",
              answer: "We accept M-Pesa, Airtel Money, Visa, Mastercard, and bank transfers.",
            },
            {
              question: "Can I change or cancel my order after placing it?",
              answer: "Yes, if the order has not been dispatched yet. Contact support immediately.",
            },
          ],
        },
        {
          title: "Delivery",
          items: [
            {
              question: "How do I track my delivery?",
              answer: "A tracking link is sent by SMS or email once your order ships.",
            },
            {
              question: "Do you deliver outside Nairobi or Kisumu?",
              answer: "Yes, we deliver across Kenya, including Eldoret, Vihiga, and Mombasa.",
            },
            {
              question: "Where can I get a reliable technician?",
              answer: "Use the Technicians page to review specialties and profiles.",
            },
          ],
        },
        {
          title: "Support and Returns",
          items: [
            {
              question: "Do you offer returns or refunds?",
              answer: "Yes, returns are accepted within 7 days, and refunds process in 3 to 5 business days.",
            },
            {
              question: "What if I receive the wrong product?",
              answer: "Share your order number and a photo, and we will replace or refund.",
            },
            {
              question: "Is there a warranty on products?",
              answer: "Most electronics include a manufacturer warranty.",
            },
          ],
        },
        {
          title: "Account and Security",
          items: [
            {
              question: "How do I reset my password?",
              answer: "Use the Forgot Password option on the login screen.",
            },
            {
              question: "Is my personal data safe?",
              answer: "Yes, we use encrypted systems and strict access controls.",
            },
          ],
        },
      ],
      quickPrompts: [
        "What services does O!clok provide?",
        "Show product categories and prices",
        "Find technicians for networking",
        "What places can I discover in Kisumu?",
        "How can I contact support?",
      ],
      position: {
        top: Math.max(20, window.innerHeight - 500),
        left: Math.max(20, window.innerWidth - 380),
      },
      bubblePos: {
        top: Math.max(10, window.innerHeight - 100),
        left: Math.max(10, window.innerWidth - 90),
      },
      drag: { active: false, offsetX: 0, offsetY: 0 },
      bubbleDrag: { active: false, offsetX: 0, offsetY: 0 },
    };
  },
  mounted() {
    window.addEventListener("resize", this.clampFloatingPositions);
    this.clampFloatingPositions();
  },
  beforeUnmount() {
    document.removeEventListener("mousemove", this.onDrag);
    document.removeEventListener("mouseup", this.stopDrag);
    document.removeEventListener("mousemove", this.onBubbleDrag);
    document.removeEventListener("mouseup", this.stopBubbleDrag);
    window.removeEventListener("resize", this.clampFloatingPositions);
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) this.scrollToBottom();
    },
    sendMessage() {
      if (!this.userInput.trim()) return;

      const text = this.userInput.trim();
      this.messages.push({ sender: "user", text });
      const reply = this.findResponse(text);

      setTimeout(() => {
        this.messages.push({ sender: "bot", text: reply.text, references: reply.references || [] });
        this.scrollToBottom();
      }, 450);

      this.userInput = "";
      this.suggestions = [];
      this.scrollToBottom();
    },
    findResponse(input) {
      const normalizedInput = this.normalizeText(input);
      const faqMatch = this.matchFAQ(normalizedInput);
      if (faqMatch) return faqMatch;

      if (/(product|store|buy|shop|price|cost|phone|watch|drone|speaker|accessor)/.test(normalizedInput)) {
        return this.buildProductsResponse(normalizedInput);
      }
      if (/(technician|technicians|expert|repair|electric|network|cctv|solar|hvac|book)/.test(normalizedInput)) {
        return this.buildTechniciansResponse(normalizedInput);
      }
      if (/(discover|place|restaurant|attraction|lounge|nature|kisumu|visit|trip)/.test(normalizedInput)) {
        return this.buildPlacesResponse();
      }
      if (/(contact|reach|phone|call|email|whatsapp)/.test(normalizedInput)) {
        return {
          text: "You can reach us at +254 732 379 292 or cambridgemediam@gmail.com. Our listed base is Kisumu, Kenya.",
          references: ["Footer Contact Details"],
        };
      }
      if (/(payment|mpesa|airtel|visa|mastercard|bank|pay)/.test(normalizedInput)) {
        return {
          text: "Supported payment channels are M-Pesa, Airtel Money, Visa, Mastercard, and bank transfer.",
          references: ["FAQ: Ordering"],
        };
      }
      if (/(delivery|shipping|track|dispatch)/.test(normalizedInput)) {
        return {
          text: "Once an order is shipped, a tracking link is sent by SMS or email. We support delivery across Kenya.",
          references: ["FAQ: Delivery"],
        };
      }
      if (/(service|offer|provide|media|cyber|robot|design|iot|ai)/.test(normalizedInput)) {
        return this.buildServicesResponse();
      }

      return {
        text: "I can help with services, products and pricing, technicians, delivery, payments, and places to discover in Kisumu.",
        references: ["FAQ Knowledge Base", "Services, Products, Technicians, and Places Data"],
      };
    },
    buildServicesResponse() {
      const topServices = this.services
        .slice(0, 4)
        .map((service) => service.title)
        .join(", ");

      return {
        text: `We currently list ${this.services.length} service lines. Key options include ${topServices}. You can explore them from Home, Media, Cyber, and Robots pages.`,
        references: ["src/data/services.json", "Routes: /media, /cyber, /robots"],
      };
    },
    buildProductsResponse(normalizedInput) {
      const categories = [...new Set(this.products.map((product) => product.category))];
      const prices = this.products
        .map((product) => Number(product.price))
        .filter((value) => Number.isFinite(value));
      const minPrice = prices.length ? Math.min(...prices) : 0;
      const maxPrice = prices.length ? Math.max(...prices) : 0;

      let filtered = this.products;
      if (normalizedInput.includes("phone")) {
        filtered = this.products.filter(
          (product) =>
            this.normalizeText(product.category).includes("phone") ||
            this.normalizeText(product.name).includes("phone")
        );
      } else if (normalizedInput.includes("watch")) {
        filtered = this.products.filter(
          (product) =>
            this.normalizeText(product.category).includes("watch") ||
            this.normalizeText(product.name).includes("watch")
        );
      } else if (normalizedInput.includes("speaker")) {
        filtered = this.products.filter(
          (product) =>
            this.normalizeText(product.category).includes("speaker") ||
            this.normalizeText(product.name).includes("speaker")
        );
      }

      const sampleProducts = (filtered.length ? filtered : this.products)
        .slice(0, 3)
        .map((product) => `${product.name} (KES ${this.formatCurrency(product.price)})`)
        .join(", ");

      return {
        text: `Our store has ${this.products.length} products in ${categories.length} categories. Price range is KES ${this.formatCurrency(minPrice)} to KES ${this.formatCurrency(maxPrice)}. Sample items: ${sampleProducts}.`,
        references: ["src/data/products.json", "Route: /products"],
      };
    },
    buildTechniciansResponse(normalizedInput) {
      const specialtyRules = [
        { keywords: ["electrical", "electrician", "wiring"], value: "Electrical Systems" },
        { keywords: ["network", "cabling", "internet"], value: "Networking & Cabling" },
        { keywords: ["cctv", "security", "camera"], value: "CCTV & Security Systems" },
        { keywords: ["solar", "renewable"], value: "Solar Installation" },
        { keywords: ["hvac", "cooling", "refrigeration"], value: "HVAC & Refrigeration" },
      ];

      let targetSpecialty = "";
      for (const rule of specialtyRules) {
        if (rule.keywords.some((keyword) => normalizedInput.includes(keyword))) {
          targetSpecialty = rule.value;
          break;
        }
      }

      let candidates = this.technicians;
      if (targetSpecialty) {
        candidates = this.technicians.filter(
          (technician) => technician.specialty.toLowerCase() === targetSpecialty.toLowerCase()
        );
      }

      const examples = candidates
        .slice(0, 3)
        .map((technician) => `${technician.name} (${technician.location})`)
        .join(", ");

      const specialtyLabel = targetSpecialty ? ` for ${targetSpecialty}` : "";
      return {
        text: `We currently list ${this.technicians.length} technicians${specialtyLabel}. ${
          examples
            ? `Example profiles: ${examples}.`
            : "I can help narrow to a specialty like electrical, networking, CCTV, solar, or HVAC."
        } Open the Technicians page to view and contact full profiles.`,
        references: ["src/data/technicians.json", "Route: /technicians"],
      };
    },
    buildPlacesResponse() {
      const categories = [...new Set(this.places.map((place) => place.category))];
      const topRated = [...this.places]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
        .map((place) => `${place.name} (${place.rating}/5)`)
        .join(", ");

      return {
        text: `The Discover section includes ${this.places.length} places around Kisumu, covering ${categories.slice(0, 5).join(", ")}. Top-rated examples are ${topRated}.`,
        references: ["src/data/places.json", "Route: /discover"],
      };
    },
    normalizeText(value) {
      return value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    },
    matchFAQ(normalizedInput) {
      const allFaqItems = this.faqData.flatMap((category) =>
        category.items.map((item) => ({ ...item, category: category.title }))
      );

      const exactMatch = allFaqItems.find(
        (item) => this.normalizeText(item.question) === normalizedInput
      );
      if (exactMatch) {
        return {
          text: exactMatch.answer,
          references: [`FAQ: ${exactMatch.category}`],
        };
      }

      let bestMatch = null;
      let bestScore = 0;

      for (const item of allFaqItems) {
        const tokens = this.normalizeText(item.question)
          .split(" ")
          .filter((token) => token.length >= 4);

        const score = tokens.reduce((total, token) => {
          return total + Number(normalizedInput.includes(token));
        }, 0);

        if (score > bestScore) {
          bestScore = score;
          bestMatch = item;
        }
      }

      if (bestMatch && bestScore >= 2) {
        return {
          text: bestMatch.answer,
          references: [`FAQ: ${bestMatch.category}`],
        };
      }

      return null;
    },
    formatCurrency(value) {
      const number = Number(value);
      if (!Number.isFinite(number)) return "0";
      return number.toLocaleString();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messages;
        if (container) container.scrollTop = container.scrollHeight;
      });
    },
    clampFloatingPositions() {
      const maxChatLeft = Math.max(10, window.innerWidth - 330);
      const maxChatTop = Math.max(10, window.innerHeight - 120);
      const maxBubbleLeft = Math.max(10, window.innerWidth - 70);
      const maxBubbleTop = Math.max(10, window.innerHeight - 70);
      this.position.left = Math.min(maxChatLeft, Math.max(10, this.position.left));
      this.position.top = Math.min(maxChatTop, Math.max(10, this.position.top));
      this.bubblePos.left = Math.min(maxBubbleLeft, Math.max(10, this.bubblePos.left));
      this.bubblePos.top = Math.min(maxBubbleTop, Math.max(10, this.bubblePos.top));
    },
    startDrag(event) {
      this.drag.active = true;
      this.drag.offsetX = event.clientX - this.position.left;
      this.drag.offsetY = event.clientY - this.position.top;
      document.addEventListener("mousemove", this.onDrag);
      document.addEventListener("mouseup", this.stopDrag);
    },
    onDrag(event) {
      if (!this.drag.active) return;
      const maxChatLeft = Math.max(10, window.innerWidth - 330);
      const maxChatTop = Math.max(10, window.innerHeight - 120);
      this.position.left = Math.min(
        maxChatLeft,
        Math.max(10, event.clientX - this.drag.offsetX)
      );
      this.position.top = Math.min(
        maxChatTop,
        Math.max(10, event.clientY - this.drag.offsetY)
      );
    },
    stopDrag() {
      this.drag.active = false;
      document.removeEventListener("mousemove", this.onDrag);
      document.removeEventListener("mouseup", this.stopDrag);
    },
    startBubbleDrag(event) {
      this.bubbleDrag.active = true;
      this.bubbleDrag.offsetX = event.clientX - this.bubblePos.left;
      this.bubbleDrag.offsetY = event.clientY - this.bubblePos.top;
      document.addEventListener("mousemove", this.onBubbleDrag);
      document.addEventListener("mouseup", this.stopBubbleDrag);
    },
    onBubbleDrag(event) {
      if (!this.bubbleDrag.active) return;
      const maxBubbleLeft = Math.max(10, window.innerWidth - 70);
      const maxBubbleTop = Math.max(10, window.innerHeight - 70);
      this.bubblePos.left = Math.min(
        maxBubbleLeft,
        Math.max(10, event.clientX - this.bubbleDrag.offsetX)
      );
      this.bubblePos.top = Math.min(
        maxBubbleTop,
        Math.max(10, event.clientY - this.bubbleDrag.offsetY)
      );
    },
    stopBubbleDrag() {
      this.bubbleDrag.active = false;
      document.removeEventListener("mousemove", this.onBubbleDrag);
      document.removeEventListener("mouseup", this.stopBubbleDrag);
    },
    generateSuggestions(input) {
      const text = input.toLowerCase().trim();
      if (!text) {
        this.suggestions = [];
        return;
      }

      const faqSuggestions = this.faqData.flatMap((category) => category.items);
      const quickSuggestions = this.quickPrompts.map((question) => ({ question }));
      this.suggestions = [...faqSuggestions, ...quickSuggestions]
        .filter((item) => item.question.toLowerCase().includes(text))
        .slice(0, 6);
    },
    applySuggestion(question) {
      this.userInput = question;
      this.suggestions = [];
      this.sendMessage();
    },
  },
};
</script>

<style scoped>
.chatbot-window {
  position: fixed;
  width: 320px;
  height: 430px;
  background: linear-gradient(160deg, #1f232a 0%, #16191f 100%);
  color: #f7f9fb;
  border-radius: 14px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  border: 1px solid #2c313a;
  box-shadow: 0 12px 32px rgba(10, 12, 16, 0.45);
  overflow: hidden;
}

.chatbot-header {
  padding: 12px 14px;
  background: #11141a;
  border-bottom: 1px solid #2e333b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  cursor: move;
}

.header-copy h4 {
  margin: 0;
  font-size: 0.96rem;
  color: #f7f9fb;
}

.header-copy small {
  display: block;
  margin-top: 2px;
  font-size: 0.72rem;
  color: #a4abb5;
}

.close-btn {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 8px;
  background: #272c35;
  color: #cbd2db;
  cursor: pointer;
}

.close-btn:hover {
  background: #313743;
}

.chatbot-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.message-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.message-row.bot {
  align-items: flex-start;
}

.message-row.user {
  align-items: flex-end;
}

.message-author {
  margin: 0 6px;
  font-size: 0.72rem;
  letter-spacing: 0.02em;
  color: #9da5b0;
}

.message-row.user .message-author {
  color: #f4c63f;
}

.message-bubble {
  max-width: 85%;
  padding: 9px 12px;
  border-radius: 14px;
  line-height: 1.35;
  font-size: 0.88rem;
  white-space: pre-wrap;
}

.message-bubble.bot {
  background: #2a3039;
  color: #edf1f5;
  border-top-left-radius: 5px;
}

.message-bubble.user {
  background: linear-gradient(135deg, #ffd54d 0%, #ffb300 100%);
  color: #19160f;
  border-top-right-radius: 5px;
}

.message-references {
  max-width: 85%;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.reference-pill {
  font-size: 0.66rem;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid #3e4552;
  color: #c3cad4;
  background: #20242c;
}

.chatbot-input {
  display: flex;
  border-top: 1px solid #2e343d;
  background: #13161c;
}

.chatbot-input input {
  flex: 1;
  padding: 11px;
  border: 0;
  outline: none;
  background: transparent;
  color: #f5f8fb;
}

.chatbot-input input::placeholder {
  color: #8f97a3;
}

.chatbot-input button {
  border: 0;
  padding: 0 15px;
  background: #ffca2c;
  color: #181511;
  font-weight: 700;
  cursor: pointer;
}

.chatbot-input button:hover {
  background: #f4bb0a;
}

.chat-bubble {
  position: fixed;
  z-index: 9999;
}

.bubble-icon {
  border: 0;
  background: #ffcc00;
  color: #101010;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.45rem;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.bubble-icon:hover {
  background: #f4bf07;
}

.suggestion-box {
  position: absolute;
  bottom: 58px;
  left: 10px;
  right: 10px;
  background: #262c35;
  color: #edf1f5;
  border-radius: 9px;
  max-height: 185px;
  overflow-y: auto;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.33);
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 10000;
  border: 1px solid #363d48;
}

.suggestion-box li {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #3f4653;
  font-size: 0.85rem;
}

.suggestion-box li:last-child {
  border-bottom: 0;
}

.suggestion-box li:hover {
  background: #313845;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}

@media (max-width: 600px) {
  .chatbot-window {
    width: calc(100vw - 20px);
    height: min(72vh, 440px);
  }

  .message-bubble,
  .message-references {
    max-width: 92%;
  }
}
</style>
