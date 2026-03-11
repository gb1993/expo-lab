---
trigger: always_on
---

1. Sempre usar o supabase para armazenar os dados.
2. Sempre usar o typescript para tipar os dados.
3. Sempre usar o themes/index.ts como base de estilo na criação de novas telas e componentes.
4. Qualquer alteração no supabase deve ser realizada através de uma migration.
5. Sempre certifique-se de respeitar o RLS.
6. Sempre usar npx supabase gen types typescript --linked > database.types.ts para recriar os types após executar uma migration.
