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

    <!-- ! Implementar divisao por componentes -->
    <!-- Modal de Gestão de Chats -->
    <div v-if="showChatModal" class="modal-overlay" @click.self="closeChatModal">
      <div class="modal-content">
        <h3>Gerir Chats</h3>

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

        <div class="modal-actions">
          <button @click="openRoomCreateModal" class="action-btn">Criar Nova Sala</button>
          <button @click="openJoinByLink" class="action-btn">Entrar por Link/Código</button>
        </div>

        <button @click="closeChatModal" class="close-btn">Fechar</button>
      </div>
    </div>

    <!-- ! Implementar divisao por componentes -->
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

          <CapacitySlider v-model="newRoom.capacity" :min="1" :max="100" />


          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="newRoom.isPrivate" class="custom-checkbox" />
              <span class="checkbox-custom">__</span>
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
        <div class="chat-window-header">
          <h3>{{ getRoomName(selectedRoom) }}</h3>
          <div v-if="isAdmin" class="settings-icon" @click="openRoomSettings">
            ⚙️
          </div>
          <button 
            v-if="!isAdmin" 
            @click="showLeaveModal = true"
            class="leave-room-btn"
          >
            Sair  <font-awesome-icon :icon="['fas', 'door-open']" />
          </button>
        </div>
        <div class="message-list" ref="messageList">
          <div 
              class="message-item" 
              :class="{ 'system-message': message.type }"
              v-for="message in messages" 
              :key="message.id"
          >
              <div 
                  v-if="!message.type" 
                  class="message-avatar"
                  :style="getUserAvatarStyle(message.user)"
              ></div>
              <div class="message-content">
                  <p class="message-user" v-if="!message.type">{{ message.user.username }}</p>
                  <p class="message-text" :class="{ 'system-text': message.type }">{{ message.text }}</p>
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


    <div v-if="selectedRoom" class="user-list">
      <h3>Utilizadores</h3>  
      <ul>
        <li v-for="user in roomUsers" :key="user._id">
          <div class="user-avatar" :style="getUserAvatarStyle(user)"></div>
          <span>{{ user.username }}</span>
        </li>
      </ul>
    </div>

    <!-- ! Implementar divisao por componentes -->
    <!-- Modal de Configurações da Sala -->
    <div v-if="showRoomSettings" class="modal-overlay room-settings-modal" @click.self="closeRoomSettings">
      <div class="modal-content room-settings-content">
        <div class="room-settings-header">
          <h3>Configurações da Sala</h3>
          <button @click="closeRoomSettings" class="close-icon">&times;</button>
        </div>

        <div class="room-settings-body">
          
          <div class="form-group room-name-group">
            <label>Nome da Sala</label>
            <input
              v-model="roomSettings.name"
              type="text"
              placeholder="Nome da sala"
              class="room-name-input"
            >
          </div>

          <div v-if="roomSettings.isPrivate" class="form-group">
            <label for="accessCode">Código de Acesso</label>
            <div class="referral-code-container">
              <input
                id="accessCode"
                ref="accessCodeInput"
                :value="roomSettings.accessCode"
                readonly
                :type="showAccessCode ? 'text' : 'password'"
                class="access-code-input"
              />
              <button @click="toggleReferralCodeVisibility" class="toggle-visibility-btn">
                {{ showAccessCode ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <div class="room-users-section">
            <h4>Utilizadores</h4>
            <div class="room-users-list">
              <div
                v-for="userI in roomUsers"
                :key="userI._id"
                class="room-user-item"
              >
                <div class="user-info">
                  <div class="user-avatar" :style="getUserAvatarStyle(userI)"></div>
                  <span class="user-name">{{ userI.username }}</span>
                </div>
                <button
                  v-if="userI._id !== user._id"
                  @click="kickUser(userI._id)"
                  class="kick-btn"
                >
                  Expulsar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="room-settings-footer">
          <button @click="deleteRoom" class="delete-btn">Apagar Sala</button>
          <button @click="saveRoomSettings" class="save-btn">Salvar</button>
          <button @click="closeRoomSettings" class="cancel-btn">Cancelar</button>
        </div>
      </div>
    </div>

  </main>
</div>

<ConfirmationModal
  :show="showDeleteConfirmation"
  title="Apagar Sala"
  message="Tem certeza que deseja apagar esta sala? Esta ação não pode ser desfeita."
  confirm-text="Apagar"
  cancel-text="Cancelar"
  @confirm="confirmDeleteRoom"
  @cancel="cancelDeleteRoom"
/>

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
    :type="toastType"
/>

<LeaveRoomModal 
  :show="showLeaveModal"
  :room-name="getRoomName(selectedRoom)"
  @close="showLeaveModal = false"
  @confirm="leaveRoom"
/>

<JoinPrivateRoom 
  :show="showJoinPrivateModal"
  @close="showJoinPrivateModal = false"
  @success="handleJoinPrivateSuccess"
/>

</template>

<script>

import { io } from "socket.io-client";
import UserSettings from "./UserSettings.vue";
import Toast from './Toast.vue';
import LeaveRoomModal from './LeaveRoomModal.vue';
import JoinPrivateRoom from "./JoinPrivateRoom.vue";
import CapacitySlider from './CapacitySlider.vue';
import ConfirmationModal from './ConfirmationModal.vue';
import { sanitizeInput } from './utils/security';

const API_URL = 'http://localhost:3000'; // to host locally (htt://localhost:3000)

export default {
  name: "Dashboard",
  components: {
    UserSettings,
    Toast,
    LeaveRoomModal,
    JoinPrivateRoom,
    CapacitySlider,
    ConfirmationModal
  },
  data() {
    return {
      user: {
        _id: null,
        username: "",
        bio: "",
        profilePicture: null,
      },
      chatRooms: [],
      selectedRoom: null,
      roomUsers: [],
      isAdmin: false,
      messages: [],
      newMessage: "",
      socket: null,
      showSettings: false,
      showToast: false,
      toastMessage: "",
      toastType: "success",
      showChatModal: false,
      publicRooms: [],
      showRoomCreateModal: false,
      newRoom: {
        name: "",
        capacity: 10,
        isPrivate: false,
      },
      showRoomSettings: false,
      roomSettings: {
        name: '',
        isPrivate: false,
        accessCode: '',
      },
      showLeaveModal: false,
      showJoinPrivateModal: false,
      showAccessCode: false,
      showDeleteConfirmation: false,
    };
  },
  methods: {

  // =============== SOCKETS ==================


  initializeSocket() {
    this.socket = io(API_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
        this.socket.emit("authenticate", sessionStorage.getItem("token"));
    });

    // Kinda working now (still would prefer a token refreshing system, maybe later will do)
    this.socket.on("authError", (message) => {
        this.logout();
    });

    this.socket.on("message", this.handleNewMessage);
    this.socket.on("roomCreated", this.handleRoomCreated);
    this.socket.on("userKicked", this.handleUserKicked);
    this.socket.on("systemMessage", this.handleSystemMessage);
    this.socket.on("updateUsers", this.handleUpdateUsers);

    this.socket.on("roomDeleted", ({ roomId }) => {
        if (this.selectedRoom === roomId) {
            this.selectedRoom = null;
            this.messages = [];
            
            this.showToast = true;
            this.toastMessage = "A sala foi excluída pelo administrador";
            this.toastType = "warning";
            setTimeout(() => {
                this.showToast = false;
            }, 3000);
        }
        
        this.chatRooms = this.chatRooms.filter(room => room._id !== roomId);
    });
  },


  // ============ MAIN FUNCTIONS ==============


  async createRoom() {
    try {

        console.log(JSON.stringify(this.newRoom));

        const response = await fetch(`${API_URL}/rooms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify(this.newRoom),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Erro ao criar sala");
        }

        const data = await response.json();
        
        await this.loadRooms();


        this.showToast = true;
        this.toastMessage = "Sala criada com sucesso!";
        this.toastType = "success";
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
        this.closeRoomCreateModal();
        this.closeChatModal();
    } catch (error) {
        this.handleError(error, "Erro ao criar sala");
    }
  },

  async confirmDeleteRoom() {
    try {
      this.socket.emit("roomDeleted", this.selectedRoom);
      const response = await fetch(`${API_URL}/rooms/${this.selectedRoom}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao apagar sala');
      }

      this.chatRooms = this.chatRooms.filter(room => room._id !== this.selectedRoom);
      this.selectedRoom = null;
      this.messages = [];
      

      this.closeRoomSettings();
      this.showToast = true;
      this.toastMessage = 'Sala apagada com sucesso';
      this.toastType = 'success';
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
      
    } catch (error) {
      this.handleError(error, 'Erro ao apagar sala');
    } finally {
      this.showDeleteConfirmation = false;
    }
  },

  async selectRoom(roomId) {
      try {
        if (this.selectedRoom) {
          this.socket.emit("deselectRoom", this.selectedRoom);
        }  

        this.selectedRoom = roomId;
        this.messages = [];
        this.roomUsers = [];

        this.socket.emit("selectRoom", roomId);
        
        await Promise.all([
          this.loadMessages(roomId),
          this.loadRoomUsers(roomId)
        ]);
      } catch (error) {
        this.handleError(error, "Erro ao selecionar sala");
      }
  },

  async joinRoom(roomId) {
    try {
      const response = await fetch(`${API_URL}/rooms/${roomId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao entrar na sala");
      }

        this.chatRooms.push(data.room);  

        this.socket.emit("joinRoom", roomId);

        this.selectRoom(data.room._id);  

        this.publicRooms = this.publicRooms.filter(room => room._id !== roomId);

        this.showToast = true;
        this.toastMessage = "Entrou na sala com sucesso!";
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
        this.closeChatModal();

    } catch (error) {
      console.error("Erro ao entrar na sala:", error);
      this.handleError(error, "Erro ao entrar na sala, capacidade máxima atingida");
    }
  },

  async leaveRoom() {
    try {
      const response = await fetch(`${API_URL}/rooms/${this.selectedRoom}/leave`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao sair da sala");
      }


      this.socket.emit("leaveRoom", this.selectedRoom);
      
      this.chatRooms = this.chatRooms.filter(room => room._id !== this.selectedRoom);
      
      this.selectedRoom = null;
      this.messages = [];
      
      this.showLeaveModal = false;
      
      this.showToast = true;
      this.toastMessage = "Você saiu da sala com sucesso";
      this.toastType = "success";
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
      
    } catch (error) {
      this.handleError(error, "Erro ao sair da sala");
      this.showLeaveModal = false;
    }
  },

  async kickUser(userId) {
    try {
        const response = await fetch(`${API_URL}/rooms/${this.selectedRoom}/kick`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Erro ao expulsar usuário");
        }
        
        this.socket.emit("kickUser", {
          roomId: this.selectedRoom,
          userId: userId
        });

        this.roomUsers = this.roomUsers.filter(user => user._id !== userId);
        this.showToast = true;
        this.toastMessage = "Usuário expulso com sucesso!";
        this.toastType = "success";
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
    } catch (error) {
        this.handleError(error, "Erro ao expulsar usuário");
    }
  },

  sendMessage() {
      if (!this.newMessage.trim() || !this.selectedRoom) return;

      const sanitizedMessage = sanitizeInput(this.newMessage.trim());
      
      const message = {
        id: new Date().getTime(),
        text: sanitizedMessage,
      };

      this.socket.emit("message", {
        roomId: this.selectedRoom,
        message,
      }, (error) => {
        if (error) {
          this.handleError(error, "Erro ao enviar mensagem");
        }
      });

      this.newMessage = "";
  },


  // ============== LOADERS ==================


  async loadMessages(roomId) {
      try {
        const response = await fetch(`${API_URL}/rooms/${roomId}/messages`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar mensagens");
        }

        const data = await response.json();
        this.messages = data.messages;
        this.$nextTick(() => this.scrollToBottom());

      } catch (error) {
        this.handleError(error, "Erro ao carregar mensagens");
      }
  },

  async loadRoomUsers(roomId) {
    try {
      const response = await fetch(`${API_URL}/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar utilizadores da sala");
      }

      const data = await response.json();
      this.roomUsers = data.room.users;
      this.isAdmin = data.room.isAdmin;
    } catch (error) {
      this.handleError(error, "Erro ao carregar utilizadores");
    }
  },

  async loadPublicRooms() {
    try {
        const response = await fetch(`${API_URL}/rooms/public`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        if(!response.ok){
          throw new Error("Erro ao buscar salas públicas");
        }

        const data = await response.json();
        this.publicRooms = data.data;
      } catch (err) {
        this.handleError(err, "Erro ao carregar salas públicas");
      }
  },

  async loadRooms() {
    try {
      const response = await fetch(`${API_URL}/rooms`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if(!response.ok) {
        throw new Error("Erro ao buscar salas");
      }

      const data = await response.json();
      this.chatRooms = data.data;
    } catch (err) {
      this.handleError(err, "Erro ao carregar salas");
    }
  },


 // =============== HANDLERS ================

 
  handleNewMessage(message) {
      this.messages = [...this.messages, message];
      this.$nextTick(() => this.scrollToBottom());
  },

  handleError(error, defaultMessage) {
      console.error(error);
      this.showToast = true;
      this.toastMessage = defaultMessage;
      this.toastType = "error";
      setTimeout(() => {
          this.showToast = false;
      }, 3000);
  },

  handleRoomCreated(room) {
      if (!this.chatRooms.find((r) => r._id === room._id)) {
        this.chatRooms.push(room);
      }
  },

  handleUserKicked(data) {
      if (data.userId === this.user._id) {
        this.selectedRoom = null;
        this.messages = [];
        this.chatRooms = this.chatRooms.filter(room => room._id !== data.roomId);
        this.showToast = true;
        this.toastMessage = "Você foi removido da sala";
        this.toastType = "warning";
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
      } else {
        this.roomUsers = this.roomUsers.filter(user => user._id !== data.userId);
        this.loadRoomUsers;
      }
  },

  async handleSystemMessage(message) {
    try {
    const systemMessage = {
      ...message,
      user: {
        username: "Sistema",
        profilePicture: null,
      }
    };

    this.messages = [...this.messages, systemMessage];
    await this.loadMessages(this.selectedRoom);
    await this.loadRoomUsers(this.selectedRoom);  
    this.$nextTick(() => this.scrollToBottom());
  } catch (err) {
    console.error(err);
  }

  },

  handleUpdateUsers(room) {
    this.loadRoomUsers(room._id);
    this.loadMessages(room._id);
  },

  handleJoinPrivateSuccess(room) {
    this.chatRooms.push(room);
    this.socket.emit("joinRoom", room._id);
    this.selectRoom(room._id);
    
    this.showToast = true;
    this.toastMessage = "Entrou na sala com sucesso!";
    this.toastType = "success";
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  },

  async deleteRoom() {
      this.showDeleteConfirmation = true;
  },

  cancelDeleteRoom() {
      this.showDeleteConfirmation = false;
  },

  // =============== MODALS =============


  openSettings() {
    this.showSettings = true;
  },

  async openChatModal() {
    try {
      await this.loadPublicRooms();
      this.showChatModal = true;
    } catch (err) {
      console.error(err);
    }
  },

  closeChatModal() {
    this.showChatModal = false;
  },

  openRoomCreateModal() {
      this.showRoomCreateModal = true;
  },

  closeRoomCreateModal() {
    this.showRoomCreateModal = false;
    this.resetRoomForm();
  },

  openRoomSettings() {
    this.showRoomSettings = true;

    const room = this.chatRooms.find((room) => room._id === this.selectedRoom);

    this.roomSettings = {
      name: room.name,
      isPrivate: room.isPrivate,
      accessCode: room.accessCode || '',
    };
  },

  closeRoomSettings() {
      this.showRoomSettings = false;
  },

  async saveRoomSettings() {
    try {
        const response = await fetch(`${API_URL}/rooms/${this.selectedRoom}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                name: this.roomSettings.name,
            }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Erro ao atualizar configurações");
        }

        this.showToast = true;
        this.toastMessage = "Configurações atualizadas com sucesso!";
        this.toastType = "success";
        this.closeRoomSettings();
    } catch (error) {
        this.handleError(error, "Erro ao atualizar configurações");
    }
  },
 
  // =============== MISC ===============


  getRoomName(roomId) {
    const room = this.chatRooms.find((room) => room._id === roomId);
    return room ? room.name : "Desconhecido";
  },

  logout() {
        if (this.socket) {
            this.socket.disconnect();
        }
        sessionStorage.removeItem("token");
        this.$router.push("/login");
  },

  updateUserProfile(userData) {
    this.user = userData;
    this.showToast = true;
    this.toastType = "success";
    this.toastMessage = "Perfil atualizado com sucesso!";
    setTimeout(() => {
      this.showToast = false;
    }, 3000);

    if(this.selectedRoom){this.loadRoomUsers(this.selectedRoom);}
      
  },

  getUserAvatarStyle(user) {
    if (user.profilePicture) return { backgroundImage: `url(${user.profilePicture})`, backgroundSize: "cover", backgroundPosition: "center" };
    if(!user.profilePicture) return { background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)" };
    },

  scrollToBottom() {
    const messageList = this.$refs.messageList;
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  },

  resetRoomForm() {
    this.newRoom = {
      name: "",
      capacity: 10,
      isPrivate: false,
    };
  },

  openJoinByLink() {
    this.showJoinPrivateModal = true;
    this.closeChatModal();
  },

  toggleReferralCodeVisibility() {
    this.showAccessCode = !this.showAccessCode;
    this.$nextTick(() => {
      const input = this.$refs.accessCodeInput;
      if (input) {
        input.type = this.showAccessCode ? 'text' : 'password';
      }
    });
  },

},

async mounted() {
    if (!sessionStorage.getItem("token")) {
      this.$router.push("/login");
      return;
    }

    this.initializeSocket();
    
    try {
      const [userResponse, roomsResponse, publicRoomsResponse] = await Promise.all([
        fetch(`${API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }),
        fetch(`${API_URL}/rooms`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }),
        fetch(`${API_URL}/rooms/public`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
      ]);

      if (!userResponse.ok || !roomsResponse.ok || !publicRoomsResponse.ok) {
        throw new Error("Erro ao carregar dados iniciais");
      }

      const userData = await userResponse.json();
      const roomsData = await roomsResponse.json();
      const publicRoomsData = await publicRoomsResponse.json();

      this.user = {
        _id: userData.user._id,
        username: userData.user.username,
        bio: userData.user.bio,
        profilePicture: userData.user.profilePicture,
      };

      this.chatRooms = roomsData.data;
      this.publicRooms = publicRoomsData.data;

    } catch (error) {
      this.handleError(error, "Erro ao carregar dados iniciais");
      this.$router.push("/login");
    }
},

beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
},
computed: {
    profilePictureStyle() {
      return this.user.profilePicture
        ? { backgroundImage: `url(${this.user.profilePicture})`, backgroundSize: "cover", backgroundPosition: "center" }
        : { background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)" };
    },
    canSendMessage() {
      return this.selectedRoom && this.socket?.connected;
    }
},
watch: {
    messages() {
      this.$nextTick(() => this.scrollToBottom());
    }
  }
};
</script>

<style scoped>

/* Dashboard */
.dashboard {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  font-family: "Inter", sans-serif;
}

/* Informações do user */
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
  max-height: calc(98vh - 120px);
  overflow-y: auto;
}

.chat-rooms ul::-webkit-scrollbar {
  width: 8px;
}

.chat-rooms ul::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.chat-rooms ul::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.chat-rooms ul::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
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
  height: 100%;
  overflow: hidden;
}

.chat-window .no-room-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.9rem;
  color: #a8b2d1;
  flex: 1;
}

.chat-window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-window-header h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4facfe;
  margin: 0;
}

.settings-icon {
  cursor: pointer;
  color: #4facfe;
  font-size: 1.2rem;
}

.settings-icon:hover {
  color: #00f2fe;
}

.leave-room-btn {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
  }

.leave-room-btn:hover {
  background: #dc2626;
}

.messages {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  max-height: 85vh;
  padding: 1rem;
}

.message-list::-webkit-scrollbar {
  width: 8px;
}

.message-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.message-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.message-list::-webkit-scrollbar-thumb:hover{
  background: rgba(255, 255, 255, 0.5);
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
  margin-top: 0.3rem;
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
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #fff;
}

.system-message {
    text-align: center;
    margin: 10px 0;
}

.system-text {
    color: #666;
    font-style: italic;
    font-size: 0.9em;
    font-weight: bold;
}

/* Input de mensagem */
.message-input {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.message-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-right: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.message-input button {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.message-input button:hover {
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
}


/* Lista de Utilizadores */
.user-list {
  width: 20%;
  background: rgba(0, 0, 0, 0.30);
  padding: 20px;
  border-left: 5px solid rgba(0, 0, 0, 0.60);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  overflow-y: auto;
}

.user-list:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.user-list h3 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #fff;
  text-align: center;
}

.user-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-list li {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease;
}

.user-list li:hover {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.7);
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-right: 15px;
  margin-left: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-list span {
  font-size: 18px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: bold;
  color: #fff;
}

/* Modal de configurações */

.room-users {
  margin: 1rem 0;
}

.room-user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.kick-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}

.kick-btn:hover {
  background: #dc2626;
}

.referral-code-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.access-code-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  background: transparent;
  color: #fff;
}

.toggle-visibility-btn {
  padding: 0.5rem 1rem;
  background: #4facfe;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-visibility-btn:hover {
  background: #0077c2;
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
  max-height: 40vh; 
  overflow-y: auto; 
}

.public-rooms ul::-webkit-scrollbar {
  width: 8px;
}

.public-rooms ul::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.public-rooms ul::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.public-rooms ul::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
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

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.custom-checkbox {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px; 
  border: 2px solid #4facfe;
  color: transparent;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
  transition: background-color 0.3s, border-color 0.3s;
}

.custom-checkbox:checked + .checkbox-custom {
  background-color: #4facfe;
  border-color: #4facfe;
}

.checkbox-custom::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 14px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: translate(-50%, -50%) rotate(45deg);
  opacity: 0;
  transition: opacity 0.3s;
}

.custom-checkbox:checked + .checkbox-custom::after {
  opacity: 1;
}


/* Modal de configurações de sala */
.room-settings-modal .modal-content {
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow-y: hidden;
}

.room-settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.room-settings-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #4facfe;
}

.close-icon {
  background: none;
  border: none;
  scale: 1.2;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.close-icon:hover {
  color: #ef4444;
}

.room-settings-body {
  flex: 1;
  padding: 1.5rem;
  overflow-y: hidden;
}

.room-name-group {
  margin-bottom: 2rem;
}

.room-name-input {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.room-name-input:focus {
  border-color: #4facfe;
  outline: none;
}

.room-users-section {
  margin-top: 1.5rem;
}

.room-users-section h4 {
  color: #4facfe;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.room-users-list {
  max-height: 200px; 
  overflow-y: auto;
  padding-right: 0.5rem;
}

.room-users-list::-webkit-scrollbar {
  width: 6px;
}

.room-users-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.room-users-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.room-user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  transition: background 0.3s ease;
}

.room-user-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.room-user-item .user-info {
  width: 45%;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: none;
}

.room-user-item .user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.room-user-item .user-name {
  margin-right: 0.2rem;
  font-size: 1rem;
  color: #fff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: bold;
}

.room-user-item .kick-btn {
  padding: 0.5rem 1rem;
  margin-right: 2rem;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.room-user-item .kick-btn:hover {
  background: #ef4444;
  color: #fff;
}

.room-settings-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.save-btn, .cancel-btn, .delete-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn {
  background: #4facfe;
  color: #fff;
  border: none;
}

.save-btn:hover {
  background: #0077c2;
}

.cancel-btn {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
}

.delete-btn:hover {
  background-color: #c82333;
}

@media (max-width: 768px) {
  .room-settings-modal .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .room-users-list {
    max-height: 250px;
  }

  .room-user-item {
    padding: 0.5rem;
  }

  .room-user-item .user-avatar {
    width: 32px;
    height: 32px;
  }

  .room-user-item .kick-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

</style>