🚗 AutoEstética — Como Rodar em Outro Computador
✅ Pré-requisitos
1. Instale o Node.js

Acesse: https://nodejs.org e baixe a versão LTS
Verifique no terminal: node -v e npm -v

2. Instale o VS Code

Acesse: https://code.visualstudio.com


📂 Passo 1 — Copie o projeto

Baixe o ZIP do Drive e extraia em alguma pasta, ex: C:\projetos\estetica-automotiva

💻 Passo 2 — Abra o terminal na pasta
bashcd C:\projetos\estetica-automotiva
dir   # deve aparecer o package.json
📦 Passo 3 — Instale as dependências
npm install
▶️ Passo 4 — Rode o projeto
npm run dev
Acesse: http://localhost:5173
⚙️ Passo 5 — Verifique o .env
Confirme que o arquivo .env existe na raiz com:
VITE_SUPABASE_URL=httpsz://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
As chaves ficam em: Supabase → Project Settings → API

❌ Erros comuns
ErroSoluçãoCannot find package.jsonVocê está na pasta errada, use cd para entrar na pasta corretaTela brancaVerifique se o .env existe e tem as chaves corretasLogin não funcionaVerifique as chaves no .env e se o usuário existe no SupabasePorta ocupadaO Vite usa 5174 automaticamente, acesse ela

📋 Resumo rápido
bashcd pasta-do-projeto
npm install
npm run dev