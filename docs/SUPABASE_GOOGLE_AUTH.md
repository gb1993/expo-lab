# Autenticação com Supabase (email e senha)

## 1. Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

- **EXPO_PUBLIC_SUPABASE_URL**: em [Supabase Dashboard](https://supabase.com/dashboard) → seu projeto → Settings → API → Project URL.
- **EXPO_PUBLIC_SUPABASE_ANON_KEY**: mesma página → Project API keys → `anon` (ou Publishable key).

## 2. Confirmação por email (magic link)

**Se ao clicar no link do email aparecer “Não foi possível conectar” em localhost:3000:** o Supabase está redirecionando para a URL errada. Ajuste abaixo.

**Se os emails pararam de chegar** depois de mudar a Site URL para `finapp://`: coloque a **Site URL** de volta em uma URL HTTP/HTTPS (ex.: `https://localhost:3000`). Só a lista **Redirect URLs** precisa ter `finapp://auth/callback`.

No Supabase:

1. **Authentication** → **URL Configuration**.

2. **Site URL**: mantenha uma URL **HTTP/HTTPS válida** (ex.: `https://localhost:3000`). **Não use** `finapp://` aqui — isso pode fazer o Supabase parar de enviar os emails.

3. **Redirect URLs**: adicione **`finapp://auth/callback`** (para o link do email abrir o app após clicar).

4. **Authentication → Email Templates** (opcional)  
   Ajuste o template “Confirm signup” se quiser. O link de confirmação enviado por email deve redirecionar para a URL acima para o app abrir e concluir o login.

5. Salve. Novos emails de confirmação passarão a usar o link correto; emails já enviados continuam com o link antigo (localhost:3000).

## 3. Senha e armazenamento

- **Regras no app**: na criação de conta a senha deve ter 8+ caracteres, letras, números e pelo menos um caractere especial. Há campo de confirmação de senha (as duas devem ser iguais).
- **Armazenamento**: o Supabase **não armazena a senha em texto puro**. Ele usa **hash** (ex.: bcrypt) no servidor. O app envia a senha só no cadastro/login via HTTPS; o cliente nunca persiste a senha. Não é necessário (nem recomendado) criptografar a senha no app — o backend já faz o armazenamento seguro.

## 4. Fluxo no app

- **Tela inicial**: Login (email + senha).
- **Criar conta**: envia confirmação por email; após clicar no link, o usuário fica logado.
- **Entrar**: login com email e senha já confirmados.
- **Minha conta**: exibe nome e email do usuário e botão Sair.
- Rotas internas (Home, Dashboard, etc.) só são acessíveis após login.
