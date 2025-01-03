<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <h2>Configurações do Perfil</h2>
            
            <div class="profile-picture-section">
                <div class="profile-preview" 
                     :style="previewStyle">
                </div>
                <input 
                    type="file" 
                    ref="fileInput" 
                    @change="handleImageUpload" 
                    accept="image/*"
                    style="display: none"
                />
                <button @click="$refs.fileInput.click()" class="upload-btn">
                    Alterar Foto
                </button>
            </div>

            <div class="bio-section">
                <label>Biografia:</label>
                <textarea 
                    v-model="newBio" 
                    placeholder="Escreva algo sobre você..."
                    maxlength="150"
                ></textarea>
                <small>{{ 150 - newBio.length }} caracteres restantes</small>
            </div>

            <div class="modal-actions">
                <button @click="saveChanges" class="save-btn">Salvar</button>
                <button @click="$emit('close')" class="cancel-btn">Cancelar</button>
            </div>
        </div>
    </div>
</template>

<script>
import compressImage from './utils/imageCompressor';

const API_URL = '';

export default {
    name: 'UserSettings',
    props: {
        show: Boolean,
        currentUser: Object
    },
    data() {
        return {
            newBio: '',
            newProfilePicture: null,
            previewUrl: null
        }
    },
    computed: {
        previewStyle() {
            return {
                backgroundImage: `url(${this.previewUrl || this.currentUser.profilePicture || ''})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }
        }
    },
    watch: {
        currentUser: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.newBio = newVal.bio || '';
                    this.previewUrl = newVal.profilePicture;
                }
            }
        }
    },
    methods: {
        async handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (file.size > 750 * 1024) {
                alert('A imagem deve ter menos de 750KB');
                return;
            }

            try {
                const compressedImage = await compressImage(file);
                this.previewUrl = compressedImage;
                this.newProfilePicture = compressedImage;
            } catch (error) {
                console.error('Erro ao processar imagem:', error);
                alert('Erro ao processar imagem. Tente novamente.');
            }
        },
        async saveChanges() {
            try {
                const response = await fetch(`${API_URL}/user/profile`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        bio: this.newBio,
                        profilePicture: this.newProfilePicture || this.currentUser.profilePicture
                    })
                });

                if (!response.ok) throw new Error('Erro ao atualizar perfil');

                const data = await response.json();
                this.$emit('update', data.user);
                this.$emit('close');
            } catch (error) {
                console.error('Erro ao salvar alterações:', error);
                alert('Erro ao salvar alterações. Tente novamente.');
            }
        }
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #1a1a2e;
    padding: 2rem;
    border-radius: 8px;
    min-width: 400px;
    color: white;
}

.profile-picture-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1rem 0;
}

.profile-preview {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: #2a2a3e;
    margin-bottom: 1rem;
    border: 3px solid #4facfe;
}

.upload-btn, .save-btn, .cancel-btn {
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    margin: 0.5rem;
    transition: all 0.3s ease-in-out;
}

.upload-btn {
    background: #4facfe;
    color: white;
}

.upload-btn:hover {
    background: #0077c2;
}

.bio-section {
    margin: 1rem 0;
}

textarea {
    width: 100%;
    min-height: 100px;
    padding: 0.5rem;
    margin: 0.5rem 0;
    border-radius: 5px;
    background: #2a2a3e;
    border: 1px solid #4facfe;
    color: white;
    resize: vertical;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
}

.save-btn {
    background: #4facfe;
    color: white;
}

.save-btn:hover {
    background: #0077c2;
}

.cancel-btn {
    background: transparent;
    border: 1px solid #4facfe;
    color: #4facfe;
}

.cancel-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

small {
    color: #a8b2d1;
}
</style>