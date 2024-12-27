<template>
  <div class="rooms-list">
    <h2>Salas</h2>
    <button @click="createRoom">Criar Sala</button>
    <ul>
      <li v-for="room in rooms" :key="room._id">
        {{ room.name }}
        <button @click="deleteRoom(room._id)">Excluir</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rooms: [],
    };
  },
  async created() {
    // Recupera o token do sessionStorage (em vez do localStorage)
    const token = sessionStorage.getItem('token');

    if (!token) {
      alert("Você precisa estar autenticado para acessar esta página.");
      this.$router.push('/login'); // Redireciona para login se não houver token
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/rooms', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        this.rooms = data; // Atualiza a lista de salas
      } else {
        alert(data.error);
        if (data.error === "Token inválido ou expirado") {
          sessionStorage.removeItem('token'); // Remove token expirado ou inválido
          this.$router.push('/login'); // Redireciona para o login
        }
      }
    } catch (error) {
      console.error("Erro ao carregar as salas:", error);
      alert("Erro ao carregar as salas.");
    }
  },
  methods: {
    async createRoom() {
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert("Você precisa estar autenticado para criar uma sala.");
        this.$router.push('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: 'Nova Sala',
            isPrivate: false,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          this.rooms.push(data.room); // Atualiza a lista de salas com a nova sala
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error("Erro ao criar sala:", error);
        alert("Erro ao criar sala.");
      }
    },
    async deleteRoom(roomId) {
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert("Você precisa estar autenticado para excluir uma sala.");
        this.$router.push('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/rooms/${roomId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          this.rooms = this.rooms.filter(room => room._id !== roomId); // Remove a sala da lista
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error("Erro ao excluir sala:", error);
        alert("Erro ao excluir sala.");
      }
    },
  },
};
</script>
