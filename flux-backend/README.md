# fluX Backend

Este é o backend da aplicação fluX desenvolvido com Node.js e Express.

## 📦 Tecnologias

- **Node.js**: Ambiente de execução JavaScript no backend.
- **Express**: Framework leve para criação de APIs REST.
- **MongoDB**: Base de dados NoSQL.
- **Mongoose**: ORM para interagir com o MongoDB.
- **bcrypt**: Encriptação de palavras-passe.
- **jsonwebtoken (JWT)**: Autenticação por token.
- **dotenv**: Variáveis de ambiente.
- **cors**: Permite chamadas entre domínios (ex: frontend → backend).

## 📁 Estrutura

```
flux-backend/
├── server.js              # Entrada principal do servidor
├── .env                   # Variáveis de ambiente (chave JWT, string de conexão)
├── config/
│   └── db.js              # Conexão com o MongoDB
├── models/
│   └── user.js            # Esquema do utilizador
├── routes/
│   └── auth.js            # Rotas de login e registo
├── controllers/
│   └── authController.js  # Lógica das rotas de autenticação
```

## 🚀 Como iniciar

1. Instalar dependências:
   ```
   npm install express mongoose dotenv bcrypt jsonwebtoken cors
   ```

2. Criar a base de dados localmente ou usar um Mongo Atlas e inserir em `.env`.

3. Iniciar o servidor:
   ```
   node server.js
   ```

Servidor disponível por padrão em `http://localhost:5000`.

## 🔐 Endpoints

- `POST /api/auth/register`: Registo de utilizador
- `POST /api/auth/login`: Login e geração de token JWT