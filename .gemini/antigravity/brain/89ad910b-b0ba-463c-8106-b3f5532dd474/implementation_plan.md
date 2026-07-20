# Gestão do Casal e Melhoria no Cadastro

Este plano aborda a criação de um painel de "Gestão do Casal" para o usuário gerenciar convites, além de aprimorar o formulário de cadastro com campos separados para Nome e Sobrenome, facilitando a identificação nos gastos.

## Open Questions
- Quando o usuário cancelar um convite pendente, ele apenas sumirá ou o parceiro receberá alguma notificação? (O padrão será apenas excluir/cancelar silenciosamente).
- Se já houver 2 pessoas no casal, a opção de "Convidar" deve sumir completamente, correto? (O padrão será esconder o botão, limitando a 2 pessoas).

## Proposed Changes

### Database Updates
- Executar query SQL para atualizar o nome da conta vinculada ao e-mail `matheusprezottodev@gmail.com` para "Matheus Prezotto".
- (Nenhuma alteração de schema necessária; "Nome" e "Sobrenome" do front-end serão concatenados e salvos na coluna existente `name` da tabela `account`).

### Authentication & Signup Flow
#### [MODIFY] app/signup/page.tsx
- Substituir o input único de "Nome" por dois inputs separados: "Nome" (`firstName`) e "Sobrenome" (`lastName`).
- Atualizar a UI para que fiquem lado a lado (em um grid de 2 colunas).

#### [MODIFY] app/signup/actions.ts
- Ajustar a lógica para capturar `firstName` e `lastName` do FormData, concatená-los (e.g. `${firstName} ${lastName}`) e salvar na tabela `account` no campo `name`.

### Gestão do Casal (Perfil)
#### [MODIFY] app/profile/page.tsx
- Adicionar consultas ao Supabase para buscar:
  1. Todas as contas pertencentes ao mesmo `household_id` do usuário.
  2. Todos os convites `pending` enviados por este `household_id`.
- Passar esses dados como novas props para o componente cliente `ProfileClient`.

#### [MODIFY] app/profile/profile-client.tsx
- Criar a nova seção "Gestão do Casal" logo abaixo dos detalhes do usuário logado.
- **Estado 1 (Casal Completo):** Mostrar os dois usuários (avatares, nomes e contribuições de cada um).
- **Estado 2 (Aguardando Parceiro):** Mostrar o usuário logado e o "card" do convite pendente (e-mail convidado e botão para "Cancelar Convite").
- **Estado 3 (Sozinho sem Convite):** Mostrar botão brilhante "Convidar Parceiro(a)", que abre um pequeno modal/formulário pedindo o E-mail e a Contribuição do parceiro.

#### [NEW] app/profile/invite-actions.ts
- Criar Server Actions para lidar com o gerenciamento de convites do perfil:
  - `cancelInvite(inviteId)`: Altera o status do convite para `canceled` ou deleta o registro.
  - `sendNewInvite(formData)`: Cria um novo convite validando se a casa tem apenas 1 pessoa.

## Verification Plan

### Manual Verification
- Testar a criação de uma conta para verificar se os campos Nome e Sobrenome são gravados corretamente no banco de dados.
- Acessar a tela de Perfil com uma conta que acabou de criar o casal (com convite) para garantir que o convite aparece como "Pendente".
- Testar o cancelamento do convite.
- Testar o envio de um novo convite direto da página de perfil e verificar se o parceiro o enxerga ao fazer login/onboarding.
- Validar se a query SQL aplicou o nome "Matheus Prezotto" corretamente no banco.
