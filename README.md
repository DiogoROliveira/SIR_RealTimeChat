# Sistema de Chat em Tempo Real

Uma aplicação de chat em tempo real construída com Vue.js e Node.js que permite aos utilizadores comunicarem em salas públicas e privadas com atualizações instantâneas de mensagens.

## Funcionalidades

-   **Autenticação de Utilizadores**

    -   Registo e login seguros com JWT
    -   Personalização do perfil do utilizador com avatares e informações sobre si mesmo

-   **Gestão de Salas**

    -   Criar e eliminar salas de chat públicas/privadas
    -   Navegar pelas salas disponíveis
    -   Entrar em salas com controlo de capacidade
    -   Acesso a salas privadas através de sistema de código de acesso

-   **Mensagens em Tempo Real**
    -   Entrega instantânea de mensagens usando tecnologia WebSocket
    -   Persistência do histórico de mensagens
    -   Notificações de presença do utilizador (eventos de entrada/saída/expulsão)

## Stack Tecnológica

Este projeto foi desenvolvido utilizando a **Stack Tecnológica MEVN** (MongoDB, Express.js, Vue.js, Node.js)

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=mongodb,express,vue,nodejs&theme=dark" />
  </a>
</p>

### Frontend

-   Vue.js 3
-   Vite
-   Socket.IO Client
-   Vue Router para navegação
-   Componentes personalizados para elementos da interface

### Backend

-   Node.js com Express
-   MongoDB para persistência de dados
-   Socket.IO para comunicação em tempo real
-   JWT para autenticação
-   Middleware personalizado para proteção de rotas

## Instalação

### Pré-requisitos

-   Node.js (v16 ou superior)
-   Instância MongoDB
-   Gestor de pacotes npm ou yarn

### Configuração do Backend

1. Navegue para o diretório backend:

```bash
cd Backend
```

2. Instale as dependências:

```bash
npm install
```

3. Navegue para o diretório /src:

```bash
cd src
```

4. Crie um ficheiro .env com as seguintes variáveis:

```js
PORT = 3000;
MONGODB_URI = seu_string_de_conexao_mongodb;
JWT_SECRET = seu_segredo_jwt;
```

5. Inicie o servidor:

```bash
npm start
```

### Configuração do Frontend

1. Navegue para o diretório frontend:

```bash
cd Frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Altere o API_URL em [Dashboard.vue](/Frontend/src/components/Dashboard.vue) para corresponder ao URL do servidor Node:

```js
API_URL = `http://localhost:3000`;
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Estrutura do Projeto

### Backend

-   `src/models/` - Esquemas e modelos da base de dados
-   `src/utils/` - Funções utilitárias, middleware e rotas
-   `src/server.js` - Ponto de entrada principal da aplicação

### Frontend

-   `src/components/` - Componentes Vue
-   `src/router/` - Definições de rotas
-   `src/assets/` - Recursos estáticos
-   `src/utils/` - Funções auxiliares

### Árvore Estrutural

```sv
|__ Backend
|    |__ /src
|    |    |__ /models
|    |    |__ /utils
|    |    |__ .env
|    |    |__ server.js
|    |__ .gitignore
|    |__ package-lock.json
|    |__ package.json
|
|__ Frontend
|    |__ /public
|    |__ /src
|    |    |__ /assets
|    |    |__ /components
|    |    |    |__ /icons
|    |    |    |__ /utils
|    |    |    |__ Vue Components
|    |    |__ /router
|    |    |__ App.vue
|    |    |__ main.js
|    |__ .gitignore
|    |__ index.html
|    |__ jsconfig.json
|    |__ package-lock.json
|    |__ package.json
|    |__ README.md
|    |__ vite.config.js
|
|__ .gitignore
|__ ENUNCIADO.md
|__ package-lock.json
|__ package.json
|__ README.en.md
|__ README.md
```

## Endpoints da API

### Autenticação

-   `POST /register` - Registo de utilizador
-   `POST /login` - Login de utilizador
-   `GET /user` - Obter informações sobre o utilizador autenticado
-   `PUT /user/profile` - Atualiza informações do utilizador

### Salas

-   `GET /rooms` - Obter todas as salas em que o utilizador autenticado está
-   `POST /rooms` - Criar nova sala
-   `DELETE /rooms/:roomId` - Eliminar sala
-   `POST /rooms/:roomId/join` - Entrar na sala
-   `POST /rooms/:accessCode/joinP` - Entrar na sala privada através do código de acesso
-   `POST /rooms/:roomId/leave` - Sair da sala
-   `POST /rooms/:roomId/kick` - Expulsar utilizador da sala

### Mensagens

-   `GET /rooms/:id/messages` - Obter histórico de mensagens da sala

## Implementação

A aplicação está implementada no render.com. Tanto o Frontend como o Backend estão implementados no mesmo URL, uma vez que o Backend serve os ficheiros estáticos do Frontend:

-   URL da Aplicação: https://project-assignment-2-29950-29216.onrender.com

## Contribuições

1. Faça fork do repositório
2. Crie um ramo de funcionalidade (`git checkout -b funcionalidade/RecursoIncrivel`)
3. Faça commit das alterações (`git commit -m 'Adicionar algum RecursoIncrivel'`)
4. Faça push para o ramo (`git push origin funcionalidade/RecursoIncrivel`)
5. Abra um Pull Request

## Autores

-   Diogo Rosas Oliveira (29950)
-   David Gonçalo Gomes Reis (29216)

## Contribuições da Equipa
### Diogo Rosas Oliveira (29950)

- Desenvolvimento principal da arquitetura do backend e implementação do servidor Node.js/Express
- Integração do Socket.IO client com o frontend
- Configuração e implementação do WebSocket usando Socket.IO
- Desenvolvimento da interface do utilizador com Vue.js 3
- Documentação técnica e estruturação do repositório
- Deployment e configuração da aplicação no render.com

### David Gonçalo Gomes Reis (29216)

- Setup inicial do projeto
- Implementação do sistema de autenticação JWT e middleware de segurança
- Implementação do sistema de routing e gestão de estado no frontend
- Design e desenvolvimento dos componentes de UI para chat e gestão de salas
- Desenvolvimento das APIs RESTful e integração com MongoDB
- Implementação do sistema de notificações em tempo real


## Licença

Este projeto está licenciado sob a Licença MIT - consulte o ficheiro [LICENSE](LICENSE) para detalhes.

## Agradecimentos

-   Professor Pedro Miguel Moreira pela orientação do projeto
-   IPVC por disponibilizar o ambiente de desenvolvimento
-   Documentação e inspiração de projetos open-source semelhantes

This in English [README.en](README.en.md).
