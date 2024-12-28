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
            :key="room.id"
            :class="{ active: room.id === selectedRoom }"
            @click="selectRoom(room.id)"
          >
            {{ room.name }}
          </li>
        </ul>
        <button class="add-chat-btn">Adicionar Chats</button>
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
            <button @click="sendMessage">ᯓ➤</button>
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
        chatRooms: [
          { id: "676f5db87b4e5d230314573d", name: "General" },
          { id: 2, name: "Random" },
          { id: 3, name: "Support" },
        ],
        selectedRoom: null,
        joined: false,
        messages: [],
        newMessage: "",
        socket: null,
        showSettings: false,
        showToast: false,
        toastMessage: "",
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
        const room = this.chatRooms.find((room) => room.id === roomId);
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
    },
    async mounted(){
        this.socket = io("http://localhost:3000");

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

        this.socket.on("message", (message) => {
            this.messages = this.messages.concat(message);
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
</style>