<template>
    <aside class="user-info">
      <div class="user-details">
        <div class="profile-picture" :style="profilePictureStyle"></div>
        <h2>@{{ user.username }}</h2>
        <p class="user-bio">{{ user.bio || "Nenhuma biografia disponível." }}</p>
        <button @click="$emit('open-settings')" class="settings-link">Configurações</button>
      </div>
      <button @click="$emit('logout')" class="logout-button">Logout</button>
    </aside>
  </template>
  
  <script>
  export default {
    name: "UserInfo",
    props: ["user"],
    computed: {
      profilePictureStyle() {
        return this.user.profilePicture
          ? { backgroundImage: `url(${this.user.profilePicture})`, backgroundSize: "cover" }
          : { background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)" };
      },
    },
  };
  </script>

  <style scoped>
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
</style>
