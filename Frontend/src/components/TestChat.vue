<template>
    <div v-if="!joined" class="parent-container">
        <div class="name-container">
            <input type="text" class="username" v-model="currentUser"/>
            <button class="join-button" v-on:click="join">Join</button>
        </div>
    </div>

    <div v-if="joined">

        <div class="list-container">
            <div v-for="message in messages" :key="message.id">
                <b>{{ message.user }}</b>: {{ message.text }}
            </div>
        </div>

        <div class="text-input-container">
            <textarea
                v-model="text"
                class="text-message"
                v-on:keyup.enter="sendMessage"
            ></textarea>
        </div>

    </div>

</template>

<script>
import { io } from "socket.io-client";

export default {
    data() {
        return {
            joined: false,
            currentUser: "",
            text: "",
            messages: [],
        }
    },
    methods: {
        join(){
            this.socket = io("http://localhost:3000")
            this.joined = true

            this.socket.on("message", (message) => {
                this.messages = this.messages.concat(message)
            })
        },

        sendMessage(){
            console.log(this.text)
            this.addMessage()
            this.text = ""
        },
        addMessage(){
            const message = {
                id: new Date().getTime(),
                text: this.text,
                user: this.currentUser
            }

            this.messages = this.messages.concat(message);

            this.socket.emit("message", message)
        }
    },
    name: 'TestChat',
}
</script>

<style scoped>

.parent-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    position: fixed;
    padding-top: 150px;
}

.name-container {
    display: flex;
    flex-direction: column;
    width: 200px;
}

.join-button {
    height: 30px;
    font-size: 20px;
}

.username {
    height: 30px;
    font-size: 20px;
    padding: 5px;
    margin-bottom: 5px;
    text-align: center;
    font-weight: bold;
}

.text-input-container {
    height: 100vh;
}

.text-message {
    width: 100%;
    position: absolute;
    bottom: 0px;
    height: 70px;
    padding: 10px;
    box-sizing: border-box;
}

</style>


<!-- TODO: Chat with Sockets -->
<!-- TODO: Dashboard page -->