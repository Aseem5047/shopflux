# ShopFlux ⚡

**ShopFlux** is a production‑grade, event‑driven e‑commerce platform built using the **MERN stack**, **Redis**, and **Stripe**, designed to demonstrate real‑world backend architecture patterns such as **Event‑Driven Architecture (EDA)**, **distributed state management**, **ledger‑based wallets**, and **scalable order processing**.

This project is intentionally designed beyond a CRUD application to reflect how modern commerce systems are built in production.

---

## 🚀 Core Highlights

- Event‑Driven Architecture (EDA)
- Redis beyond caching (locks, queues, idempotency)
- Ledger‑based wallet system
- Stripe payments + wallet coexistence
- Cookie‑based authentication (HTTP‑only)
- Scalable order & inventory workflows
- Clean domain‑driven modular backend

---

## 🧠 Architecture Philosophy

ShopFlux follows these core principles:

- **Loose coupling via events** — services communicate through events, not direct calls
- **Backend as source of truth** — frontend reacts to state, not business logic
- **Eventually consistent workflows** — long‑running processes are async
- **Money is a ledger, not a number** — wallet balance is derived from transactions

---

## 🧩 Tech Stack

### Frontend

- React
- Axios (cookie‑based auth)
- Stripe.js
- State Management: Redux Toolkit / Zustand

### Backend

- Node.js + Express
- MongoDB (primary database)
- Redis (cache, locks, streams, idempotency)
- Stripe SDK
- JWT (HTTP‑only cookies)

### Infrastructure

- Docker (MongoDB & Redis)
- Webhooks (Stripe)

---

## 🏗️ System Domains

ShopFlux is divided into clear bounded contexts:

- **Auth Domain** – authentication & session handling
- **Product Domain** – product catalog & inventory
- **Cart Domain** – Redis‑based cart state
- **Order Domain** – order lifecycle & state machine
- **Payment Domain** – Stripe integration & verification
- **Wallet Domain** – internal ledger & payouts
- **Event System** – async communication backbone

---

## 🔁 Event‑Driven Flow (High Level)

```txt
USER_ACTION
   ↓
API COMMAND
   ↓
EVENT EMITTED
   ↓
ASYNC CONSUMERS
   ↓
STATE TRANSITIONS
```

### Key Events

- `ORDER_CREATED`
- `INVENTORY_RESERVED`
- `PAYMENT_INTENT_CREATED`
- `PAYMENT_SUCCEEDED`
- `PAYMENT_FAILED`
- `ORDER_CONFIRMED`
- `WALLET_CREDITED`
- `WALLET_DEBITED`

---

## 🛒 Order Lifecycle

```txt
CART
  ↓
ORDER_CREATED
  ↓
INVENTORY_RESERVED
  ↓
PAYMENT_PENDING
  ↓
PAYMENT_SUCCEEDED
  ↓
ORDER_CONFIRMED
  ↓
ORDER_SHIPPED
  ↓
ORDER_DELIVERED
```

Failure states:

- `PAYMENT_FAILED`
- `ORDER_CANCELLED`
- `ORDER_EXPIRED`

Orders never skip states.

---

## 💰 Wallet System

ShopFlux implements a **ledger‑based wallet**, similar to real payment systems.

### Wallet Transactions

- CREDIT – product sold
- DEBIT – product purchased
- REFUND – order cancellation
- WITHDRAWAL – payout (future)

Wallet balance is **derived**, not authoritative.

---

## 💳 Payments Strategy

- Stripe is used as an **external funding source**
- Wallet is used for **internal money flow**
- Mixed payments are supported

Example:

```txt
Order Total: ₹1000
Wallet Balance: ₹300

→ Wallet Debit: ₹300
→ Stripe Charge: ₹700
```

Only Stripe webhooks confirm payments.

---

## 🧠 Redis Responsibilities

Redis is a first‑class citizen in ShopFlux.

| Use Case             | Redis Pattern   |
| -------------------- | --------------- |
| Cart                 | HASH            |
| Product Cache        | STRING / JSON   |
| Inventory Lock       | SETNX + TTL     |
| Event Queue          | Streams / Lists |
| Idempotency          | SET             |
| Wallet Balance Cache | STRING          |

---

## 📂 Folder Structure

```txt
ecommerce-eda/
 ├─ backend/
 │   ├─ src/
 │   │   ├─ modules/
 │   │   │   ├─ auth/
 │   │   │   ├─ products/
 │   │   │   ├─ cart/
 │   │   │   ├─ orders/
 │   │   │   ├─ payments/
 │   │   │   ├─ wallet/
 │   │   ├─ events/
 │   │   ├─ workers/
 │   │   ├─ config/
 │   │   └─ utils/
 │   └─ server.js
 ├─ frontend/
 ├─ docker/
 └─ README.md
```

---

## 🛠️ Development Setup

### Prerequisites

- Node.js
- Docker
- Stripe CLI (for webhooks)

### Start MongoDB & Redis

```bash
docker run -d -p 27017:27017 mongo
docker run -d -p 6379:6379 redis

# 1️⃣ Start Docker DBs
npm run docker:start

# 2️⃣ Start backend in dev mode
npm run dev

# 3️⃣ Stop Docker DBs when done
npm run docker:stop

```

---

## 🧪 Project Status

🚧 **Actively in development**

Planned milestones:

- ***

## 🎯 Why ShopFlux Exists

ShopFlux is built to:

- Learn real‑world backend architecture
- Demonstrate EDA & Redis mastery
- Showcase payment & wallet systems
- Serve as a strong portfolio project

---

## 📌 Future Enhancements

- Order shipping simulation
- Wallet withdrawals
- Admin dashboard
- Email notifications
- Search indexing

---

## 🧑‍💻 Author

Built by **Aseem Gupta**

> _"Not just another e‑commerce app — ShopFlux is about flow."_
