# ADR 001: Single Identity (Supabase Compartilhado)

## Status
Aceito

## Contexto
O ecossistema Kalon (que inclui produtos como Kalon Analyzer, Kalon Connect e agora Kalon Astro Alpha) precisa de um sistema de autenticação e gestão de usuários. Uma abordagem comum seria que cada produto mantivesse sua própria tabela de usuários ou seu próprio provedor de identidade, garantindo desacoplamento total.

No entanto, a visão do ecossistema é que um único usuário possa transitar de forma fluida e sem atritos entre todas as ferramentas da suíte.

## Decisão
**Kalon Astro Alpha utiliza a instância Supabase compartilhada do ecossistema (`lpnzpimxwtexazokytjo`) para autenticação.**

Por decisão da Supervisora:
- Toda a suíte Kalon opera com identidade única de usuário (Single Identity).
- O Kalon Astro não criará tabelas de autenticação próprias nesta etapa.
- Cada aplicação manterá seus próprios dados de negócio (em schemas ou tabelas segregadas, se necessário no futuro), mas compartilha a autenticação, perfil básico e gestão de acesso na mesma base de dados.

## Consequências
- **Positivas:** Uma única conta para o usuário final; facilidade em implementar features de "Single Sign-On" (SSO) no futuro; redução de sobrecarga operacional ao não ter que manter múltiplas instâncias de Supabase Auth.
- **Negativas / Riscos:** Acoplamento forte no nível de identidade. Se a instância do ecossistema falhar, o Kalon Astro também perderá a funcionalidade de login.
- **Visão Futura:** Tabelas de gestão de acesso granulares por produto (como `kalon_accounts`, `kalon_subscriptions`) ficam como visão futura. Por enquanto, não entram no escopo do Alpha.
