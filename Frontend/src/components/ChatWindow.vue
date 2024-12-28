<template>
    <div class="chat-window">
      <div class="messages">
        <h3>{{ roomName }}</h3>
        <div class="message-list">
          <div
            class="message-item"
            v-for="message in messages"
            :key="message.id"
          >
            <div
              class="message-avatar"
              :style="{ backgroundImage: message.user.profilePicture ? `url(${message.user.profilePicture})` : 'linear-gradient(135deg, #00ff2fe 0%, #4facfe 100%)', backgroundSize: 'cover' }"
            ></div>
            <div class="message-content">
              <p class="message-user">{{ message.user.username }}</p>
              <p class="message-text">{{ message.text }}</p>
            </div>
          </div>
        </div>
        <div class="message-input">
          <input
            type="text"
            v-model="newMessage"
            placeholder="Escreva uma mensagem..."
            @keyup.enter="$emit('send-message', newMessage)"
          />
          <button @click="$emit('send-message', newMessage)">Enviar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ChatWindow",
    props: ["selectedRoom", "messages", "roomName"],
    data() {
      return { newMessage: "" };
    },
  };
  </script>

  <style scoped>
  .chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.messages {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.message-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4facfe;
  margin-right: 0.8rem;
}

.message-content {
  flex: 1;
}

.message-user {
  font-weight: bold;
  margin-bottom: 0.2rem;
  color: #4facfe;
}

.message-text {
  font-size: 0.9rem;
  color: #fff;
}

/* Input de mensagem */
.message-input {
  display: flex;
}

.message-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-right: 0.5rem;
}

.message-input button {
  padding: 0.5rem;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
</style>
