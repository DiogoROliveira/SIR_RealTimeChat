<template>
  <div class="dashboard">
    <aside class="user-info">
      <div class="user-details">
        <div class="profile-picture" :style="profilePictureStyle"></div>
        <h2>@{{ user.username }}</h2>
        <p class="user-bio">{{ user.bio || "Nenhuma biografia disponível." }}</p>
        <button @click="openSettings" class="settings-link">Configurações</button>
      </div>
      <button @click="logout" class="logout-button">Logout</button>
    </aside>

  <main class="chat-section">
    <div class="chat-rooms">
      <h2>Grupos</h2>
      <ul>
        <li
          v-for="room in chatRooms"
          :key="room._id"
          :class="{ active: room._id === selectedRoom }"
          @click="selectRoom(room._id)"
        >
          {{ room.name }}
        </li>
      </ul>
      <button class="add-chat-btn" @click="openChatModal">Adicionar Chats</button>
    </div>

    <div v-if="showChatModal" class="modal-overlay" @click.self="closeChatModal">
      <div class="modal-content">
        <h3>Gerir Chats</h3>

        <!-- Listagem de salas públicas -->
        <div class="public-rooms">
          <h4>Salas Públicas</h4>
          <ul v-if="publicRooms.length">
            <li v-for="room in publicRooms" :key="room._id">
              {{ room.name }}
              <button @click="joinRoom(room._id)" class="join-btn">Entrar</button>
            </li>
          </ul>
          <p v-else>Nenhuma sala pública disponível no momento.</p>
        </div>

        <!-- Botões adicionais -->
        <div class="modal-actions">
          <button @click="openRoomCreateModal" class="action-btn">Criar Nova Sala</button>
          <button @click="openJoinByLink" class="action-btn">Entrar por Link/Código</button>
        </div>

        <button @click="closeChatModal" class="close-btn">Fechar</button>
      </div>
    </div>

    <!-- Modal de Criação de Sala -->
    <div v-if="showRoomCreateModal" class="modal-overlay" @click.self="closeRoomCreateModal">
      <div class="modal-content">
        <h3>Criar Nova Sala</h3>

        <form @submit.prevent="createRoom">
          <div class="form-group">
            <label for="roomName">Nome da Sala</label>
            <input
              type="text"
              id="roomName"
              v-model="newRoom.name"
              required
              placeholder="Nome da sala"
            />
          </div>

          <div class="form-group">
            <label for="roomCapacity">Capacidade</label>
            <input
              type="number"
              id="roomCapacity"
              v-model="newRoom.capacity"
              required
              placeholder="Capacidade da sala"
            />
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" v-model="newRoom.isPrivate" />
              Sala Privada
            </label>
          </div>

          <div class="modal-actions">
            <button type="submit" class="action-btn">Criar Sala</button>
            <button @click="closeRoomCreateModal" class="close-btn">Fechar</button>
          </div>
        </form>
      </div>
    </div>

    <div class="chat-window">
      <div v-if="selectedRoom" class="messages">
        <h3>{{ getRoomName(selectedRoom) }}</h3>
        <div class="message-list">
          <div
            class="message-item"
            v-for="message in messages"
            :key="message.id"
          >
            <div
            class="message-avatar"
            :style="{
              backgroundImage: message.user.profilePicture
                ? `url(${message.user.profilePicture})`
                : 'linear-gradient(135deg, #00ff2fe 0%, #4facfe 100%)',
              backgroundSize: 'cover'
            }"
            ></div>
            <div class="message-content">
              <p class="message-user">{{ message.user.username }}</p>
              <p class="message-text">{{ message.text }}</p>
            </div>
          </div>
        </div>
        <div class="message-input">
          <input
            v-on:keyup.enter="sendMessage"
            type="text"
            v-model="newMessage"
            placeholder="Escreva uma mensagem..."
          />
          <button @click="sendMessage">Enviar</button>
        </div>
      </div>
      <div v-else class="no-room-selected">
        <p>Selecione um grupo para começar a conversar.</p>
      </div>
    </div>
  </main>
</div>

<UserSettings 
    v-if="showSettings"
    :show="showSettings"
    :currentUser="user"
    @close="showSettings = false"
    @update="updateUserProfile"
/>

<Toast 
    :show="showToast"
    :message="toastMessage"
    type="success"
/>
</template>

<script>

import { io } from "socket.io-client";
import UserSettings from "./UserSettings.vue";
import Toast from './Toast.vue';

export default {
name: "Dashboard",
components: {
  UserSettings,
  Toast,
},
data() {
  return {
    user: {
      username: "",
      bio: "",
      profilePicture: null,
    },
    chatRooms: [],
    selectedRoom: null,
    joined: false,
    messages: [],
    newMessage: "",
    socket: null,
    showSettings: false,
    showToast: false,
    toastMessage: "",
    showChatModal: false,
    publicRooms: [],
    showRoomCreateModal: false,
    newRoom: {
      name: "",
      capacity: 10,
      isPrivate: false,
    },
  };
},
methods: {
  async selectRoom(roomId) {
    try {
      if (this.selectedRoom) {
          this.socket.emit("leaveRoom", this.selectedRoom);
      }  

      this.selectedRoom = roomId;
      this.messages = [];

      this.socket.emit("authenticate",sessionStorage.getItem("token"));

      this.socket.emit("joinRoom", roomId);

      await this.loadMessages(roomId);
    } catch (error) {
      console.error("Erro ao selecionar sala:", error); 
    }
  },
  async loadMessages(roomId) {
    try {
      const response = await fetch(`http://localhost:3000/rooms/${roomId}/messages`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar mensagens");
      }

      const data = await response.json();
      console.log(data);
      this.messages = data.messages;

      this.$nextTick(() => {
        const messageList = this.$el.querySelector(".message-list");
        if (messageList){
          messageList.scrollTop = messageList.scrollHeight;
        }
      });

    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
  },
  sendMessage() {
    if (this.newMessage.trim()) {
      
      const message = {
        id: new Date().getTime(),
        text: this.newMessage.trim(),
      };

      this.socket.emit("message", {
        roomId: this.selectedRoom,
        message,
      });

      this.newMessage = "";
    }
  },
  getRoomName(roomId) {
    const room = this.chatRooms.find((room) => room._id === roomId);
    return room ? room.name : "Desconhecido";
  },
  logout() {
        if (this.socket) {
            this.socket.disconnect();
        }
        sessionStorage.removeItem("token"); // Remove o token de autenticação
        this.$router.push("/login"); // Redireciona para a página de login
  },
  openSettings() {
    this.showSettings = true;
  },
  updateUserProfile(userData) {
    this.user = userData;
    this.showToast = true;
    this.toastMessage = "Perfil atualizado com sucesso!";
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  },
  openChatModal() {
  this.showChatModal = true;
  },
  closeChatModal() {
    this.showChatModal = false;
  },
  async createRoom() {
    try {
      const response = await fetch("http://localhost:3000/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(this.newRoom),
      });

      const data = await response.json();
      if (response.ok) {
        this.chatRooms.push(data.data);
        this.selectRoom(data.data.id); // Seleciona a nova sala
        this.showToast = true;
        this.toastMessage = "Sala criada com sucesso!";
        this.closeRoomCreateModal();
      } else {
        alert(data.error || "Erro ao criar sala.");
      }
    } catch (error) {
      console.error("Erro ao criar sala:", error);
      alert("Erro ao criar sala.");
    }
  },
  openRoomCreateModal() {
      this.showRoomCreateModal = true;
  },
  closeRoomCreateModal() {
    this.showRoomCreateModal = false;
    this.resetRoomForm();
  },
  resetRoomForm() {
    this.newRoom = {
      name: "",
      capacity: 10,
      isPrivate: false,
    };
  },
  openJoinByLink() {
    alert("Entrar por link/código clicado! Placeholder para funcionalidade futura.");
  },
  async joinRoom(roomId) {
    try {
      const response = await fetch(`http://localhost:3000/rooms/${roomId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        this.chatRooms.push(data.room);  
        this.selectRoom(data.room._id);  
        this.showToast = true;
        this.toastMessage = "Entrou na sala com sucesso!";
        this.closeChatModal();
      } else {
        alert(data.error || "Erro ao entrar na sala.");
      }
    } catch (error) {
      console.error("Erro ao entrar na sala:", error);
      alert("Erro ao entrar na sala.");
    }
  },
},
async mounted(){
    this.socket = io("http://localhost:3000");

    // get user info
    try {
        const response = await fetch("http://localhost:3000/user", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar usuário");
        }

        const data = await response.json();
        this.user = {
            username: data.user.username,
            bio: data.user.bio,
            profilePicture: data.user.profilePicture,
        };

    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        this.$router.push("/login");
    }

    // get users chat rooms
    try {
      const response = await fetch("http://localhost:3000/rooms", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar salas");
      }

      const res = await response.json();
      console.log(res.data);
      this.chatRooms = res.data;

    } catch (error) {
      console.error("Erro ao buscar salas:", error);
      this.$router.push("/login");
    }

    // get public rooms
    try {
      const response = await fetch("http://localhost:3000/rooms/public", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar salas públicas");
      }

      const data = await response.json();
      this.publicRooms = data.data;
      console.log(data.data);
    } catch (error) {
      console.error("Erro ao buscar salas públicas:", error);
    }

    this.socket.on("message", (message) => {
        this.messages = this.messages.concat(message);
    });

    this.socket.on("roomCreated", (room) => {
      if (!this.chatRooms.find((r) => r.id === room.id)) {
          this.chatRooms.push(room);
      }
    });

},
beforeUnmount(){
    if (this.socket) {
        this.socket.disconnect();
    }
},
computed: {
  profilePictureStyle() {
    return this.user.profilePicture
      ? { backgroundImage: `url(${this.user.profilePicture})`, backgroundSize: "cover" }
      : { background: "linear-gradient(135deg, #00ff2fe 0%, #4facfe 100%)" };
  }
}
};
</script>

<style scoped>
/* Layout principal */
.dashboard {
display: flex;
height: 100vh;
background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
color: #fff;
font-family: "Inter", sans-serif;
}

/* Informações do usuário */
.user-info {
width: 20%;
background: rgba(0, 0, 0, 0.5);
display: flex;
flex-direction: column;
align-items: center;
padding: 2rem;
border-right: 1px solid rgba(255, 255, 255, 0.1);
position: relative;
}

.user-details {
text-align: center;
margin-bottom: auto;
}

.profile-picture {
width: 100px;
height: 100px;
border-radius: 50%;
background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
margin: 0 auto 1rem;
}

.user-details h2 {
margin: 0.5rem 0;
}

.user-bio {
font-size: 0.9rem;
color: #a8b2d1;
}

/* Botão de configurações */
.settings-link {
margin: 1rem 0;
padding: 0.5rem 1rem;
border: 1px solid rgba(255, 255, 255, 0.3);
border-radius: 5px;
background: rgba(0, 0, 0, 0.2);
color: #4facfe;
cursor: pointer;
transition: all 0.3s ease;
}

.settings-link:hover {
background: #4facfe;
color: #fff;
}

/* Botão de logout fixo */
.logout-button {
width: calc(100% - 4rem);
position: absolute;
bottom: 2rem;
left: 2rem;
padding: 0.7rem 1rem;
background: #ef4444;
color: white;
border: none;
border-radius: 5px;
font-size: 1rem;
font-weight: 500;
text-align: center;
cursor: pointer;
transition: background 0.3s ease;
}

.logout-button:hover {
background: #dc2626;
}

/* Seção de chats */
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

/* Janela de mensagens */
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

/* Modal adicionar chats */
.modal-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
}

.modal-content {
background: #1e1e2f;
color: #fff;
padding: 2rem;
border-radius: 8px;
width: 400px;
text-align: center;
}

.modal-content h3 {
margin-bottom: 1rem;
}

.public-rooms ul {
list-style: none;
padding: 0;
margin: 1rem 0;
}

.public-rooms li {
display: flex;
justify-content: space-between;
align-items: center;
background: rgba(255, 255, 255, 0.1);
padding: 0.5rem 1rem;
border-radius: 4px;
margin-bottom: 0.5rem;
}

.join-btn {
background: #4caf50;
color: #fff;
border: none;
padding: 0.4rem 0.8rem;
border-radius: 4px;
cursor: pointer;
transition: background 0.3s;
}

.join-btn:hover {
background: #43a047;
}

.modal-actions {
margin: 1rem 0;
}

.action-btn {
background: #4facfe;
color: #fff;
border: none;
padding: 0.5rem 1rem;
margin: 0.5rem;
border-radius: 4px;
cursor: pointer;
transition: background 0.3s;
}

.action-btn:hover {
background: #0077c2;
}

.close-btn {
background: #ef4444;
color: #fff;
border: none;
padding: 0.5rem 1rem;
border-radius: 4px;
cursor: pointer;
transition: background 0.3s;
}

.close-btn:hover {
background: #dc2626;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  background: transparent;
  color: #fff;
}

</style>