# 🛡️ Portal Emergência — App de Kits de Emergência

Aplicação mobile React Native (Expo) para venda de kits de emergência e sobrevivência.

---

## 🚀 Instalação Rápida

### 1. Pré-requisitos
- **Node.js** v18 ou superior → https://nodejs.org
- **Expo Go** instalado no telemóvel:
  - iOS: https://apps.apple.com/app/expo-go/id982107779
  - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

### 2. Instalar dependências
```bash
cd SafeKitApp
npm install
```

### 3. Correr a aplicação
```bash
npx expo start
```

Aparece um QR Code no terminal. Abra o **Expo Go** no telemóvel e digitalize-o.

---

## 📱 Credenciais de Demo

| Perfil        | Email                    | Password  |
|---------------|--------------------------|-----------|
| Administrador | admin@emergencia.pt      | admin123  |
| Cliente       | joao@email.com           | user123   |
| Cliente       | maria@email.com          | user123   |

---

## 📁 Estrutura do Projeto

```
SafeKitApp/
├── App.js                           # Entry point principal
├── app.json                         # Configuração Expo
├── src/
│   ├── theme.js                     # Cores, fontes, espaçamentos
│   ├── data/
│   │   └── db.js                    # Base de dados em memória (dados iniciais)
│   ├── context/
│   │   └── AppContext.js            # Estado global: auth, cart, produtos
│   ├── components/
│   │   └── UI.js                    # Componentes reutilizáveis (Button, Input, Card...)
│   ├── navigation/
│   │   └── AppNavigator.js          # Bottom tabs + Stack navigation
│   └── screens/
│       ├── AuthScreen.js            # Login e registo
│       ├── HomeScreen.js            # Catálogo + pesquisa + filtros por categoria
│       ├── ProductDetailScreen.js   # Detalhe do produto + seleção quantidade
│       ├── CartScreen.js            # Carrinho + checkout
│       ├── OrdersScreen.js          # Histórico de encomendas
│       ├── AdminScreen.js           # Dashboard admin completo
│       └── ProfileScreen.js         # Perfil do utilizador
```

---

## ✅ Funcionalidades

### Área Cliente
- [x] Registo e login de utilizadores
- [x] Catálogo de produtos com emoji, preço, stock e categoria
- [x] Pesquisa em tempo real
- [x] Filtros por categoria (Kits, Equipamento, Sobrevivência, Médico, Energia, Alimentação)
- [x] Página de detalhe com seletor de quantidade
- [x] Carrinho de compras (adicionar, remover, atualizar quantidades)
- [x] Validação de stock antes de checkout
- [x] Checkout com geração de ID de encomenda
- [x] Histórico de encomendas pessoais
- [x] Perfil com estatísticas (total gasto, nº de encomendas)

### Área Admin (menu ⚙️)
- [x] Dashboard com estatísticas (receita total, encomendas, utilizadores, produtos)
- [x] Gestão de produtos: criar, editar e apagar
- [x] Atualização de stock e preços
- [x] Lista de todos os utilizadores com roles
- [x] Histórico completo de todas as encomendas

### Técnico
- [x] Persistência com AsyncStorage (dados guardam entre sessões)
- [x] Contexto global React (sem Redux)
- [x] Navegação com React Navigation (Bottom Tabs + Stack)
- [x] Safe Area compatível com notch/ilha dinâmica
- [x] Tema dark consistente

---

## 🗄️ Modelo de Dados

```
Users         { id, nome, email, password, role, created_at }
Products      { id, nome, descricao, preco, stock, imagem, categoria }
Orders        { id, user_id, data, valor_total, status }
Order_Items   { id, order_id, product_id, quantidade, preco_unitario }
```

---

## 📦 Build para Produção

Para gerar APK (Android) ou IPA (iOS):

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login na conta Expo
eas login

# Configurar build
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

---

## 🛠️ Tecnologias

- **React Native** 0.83 + **Expo** ~55
- **React Navigation** 7 (Bottom Tabs + Stack)
- **AsyncStorage** para persistência local
- **React Context API** para estado global
