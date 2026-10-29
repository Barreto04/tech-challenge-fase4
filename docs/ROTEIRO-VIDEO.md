# Roteiro da apresentação gravada (máx. 15 min)

Sugestão de divisão de tempo para a demonstração em vídeo. Grave com a API já no ar (`npm run dev:memory` ou `docker compose up -d`) e o emulador aberto, para não gastar tempo de vídeo esperando build.

---

## 0 · Antes de gravar (checklist)

- [ ] `cd backend && npm test` passando (mostra 22 testes verdes — bom material para a parte técnica)
- [ ] API no ar em `http://localhost:3001`
- [ ] Emulador Android aberto com o app instalado (`cd mobile && npm run android`)
- [ ] Banco com os dados do seed (professor, alunos e 3 posts)
- [ ] Um post extra preparado mentalmente para criar ao vivo

---

## 1 · Abertura — 1 min

- Nome do grupo e integrantes.
- O que é a entrega: interface mobile em React Native para a aplicação de blogging das fases anteriores.
- Mostrar a estrutura do repositório (`backend/` e `mobile/`) por 10 segundos.

## 2 · Demonstração como visitante / aluno — 2 min

- Abrir o app: lista de posts com título, autor, data e resumo.
- Usar a busca (digitar uma palavra e mostrar a filtragem).
- Abrir um post e ler o conteúdo completo.
- Chamar atenção: **não existe botão de criar e não existe aba Admin**.

## 3 · Login — 1 min 30

- Aba *Perfil* → **Entrar** → credenciais de professor.
- Destacar que a aba *Admin* e o botão flutuante **+** aparecem depois do login.
- Mostrar a aba *Perfil* com o papel e as permissões da conta.

## 4 · Fluxo de posts como professor — 2 min 30

- Criar um post pelo botão **+** (título, autor, conteúdo) e mostrá-lo no topo da lista.
- Abrir o post criado → **Editar** → salvar alteração.
- *Admin → Postagens*: mostrar a listagem administrativa com editar/excluir e a confirmação de exclusão.

## 5 · Administração de professores e alunos — 2 min

- *Admin → Professores*: listagem paginada, cadastrar um professor, editar, excluir.
- *Admin → Alunos*: mostrar que o fluxo é idêntico, com o campo *Turma*.
- Comentar que as duas telas são o mesmo componente parametrizado por `role`.

## 6 · Permissões na prática — 1 min

- Sair da conta e logar como **aluno** (`bruna.lima@aluno.postech.com`).
- Mostrar que a aba *Admin* e o botão de criar não existem para esse perfil.
- Opcional (impacta bem): com o Postman/curl, tentar `POST /posts` com o token do aluno e mostrar o **403**, provando que a regra está no servidor, não só na interface.

## 7 · Detalhes técnicos — 3 min 30

Mostre o código, não só slides:

- `backend/src/models/User.js` — um modelo para professor e aluno, hash de senha no `pre('save')`, `select: false`.
- `backend/src/middlewares/auth.js` — `autenticar` (valida JWT e recarrega o usuário) e `autorizar('professor')`.
- `backend/src/controllers/userController.js` — a fábrica que gera o CRUD das duas entidades.
- `mobile/src/contexts/AuthContext.js` — sessão no `AsyncStorage` e revalidação em `/auth/me`.
- `mobile/src/api/client.js` — interceptors e a resolução de URL por plataforma (`10.0.2.2` no emulador).
- `mobile/src/hooks/useListaPaginada.js` — paginação, debounce e descarte de resposta fora de ordem.
- `npm test` rodando no backend.

## 8 · Desafios e encerramento — 1 min 30

- A API da Fase 02 não tinha usuários nem autenticação: foi preciso estendê-la antes das telas.
- `localhost` dentro do emulador Android não é a máquina — como foi resolvido.
- Projeto retomado em outra máquina, o que levou ao modo `dev:memory` sem Docker.
- Fechamento: o que o grupo faria a seguir (comentários nos posts, upload de imagem, notificações).

---

### Dicas de gravação

- Grave a tela do emulador junto com o VS Code em janelas separadas e alterne — evita zoom e corte.
- Fale sobre a decisão, não sobre a sintaxe: "escolhemos X porque Y" rende mais nota do que ler código linha a linha.
- Cronometre o bloco 7; é o que costuma estourar o tempo.
