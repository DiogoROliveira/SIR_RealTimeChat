<template>
    <div class="chat-rooms">
      <h2>Grupos</h2>
      <ul>
        <li
          v-for="room in chatRooms"
          :key="room.id"
          :class="{ active: room.id === selectedRoom }"
          @click="$emit('select-room', room.id)"
        >
          {{ room.name }}
        </li>
      </ul>
      <button class="add-chat-btn" @click="$emit('open-modal')">Adicionar Chats</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "ChatRooms",
    props: ["chatRooms", "selectedRoom"],
  };
  </script>

  <style scoped>
  .chat-section {
  flex: 1;
  display: flex;
}

.chat-rooms {
  width: 25%;
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-rooms h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #4facfe;
}

.chat-rooms ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chat-rooms li {
  padding: 0.5rem 0.8rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-rooms li:hover,
.chat-rooms li.active {
  background: rgba(255, 255, 255, 0.1);
}

.add-chat-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.5rem;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  border: none;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}
</style>