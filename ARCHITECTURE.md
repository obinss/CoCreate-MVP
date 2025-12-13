# CoCreate Platform - Architecture Documentation

## Overview

CoCreate is currently a **frontend-only MVP** serving as a proof-of-concept for a B2B2C marketplace connecting contractors with surplus construction materials to buyers (SMEs, tradespeople, DIYers).

---

## C4 Model Diagrams

### Context Diagram

```mermaid
C4Context
    title System Context - CoCreate Platform

    Person(buyer, "Buyer", "Contractors, DIYers seeking materials")
    Person(seller, "Seller", "Contractors with surplus inventory")
    Person(admin, "Admin", "Platform administrator")

    System(cocreate, "CoCreate Platform", "Web-based marketplace for construction materials")

    System_Ext(stripe, "Stripe", "Payment processing & escrow")
    System_Ext(freight, "Freight APIs", "DHL/Uber for delivery quotes")
    System_Ext(maps, "Maps API", "Location services")

    Rel(buyer, cocreate, "Browses, purchases")
    Rel(seller, cocreate, "Lists inventory, manages orders")
    Rel(admin, cocreate, "Verifies sellers, moderates")
    Rel(cocreate, stripe, "Processes payments")
    Rel(cocreate, freight, "Gets shipping quotes")
    Rel(cocreate, maps, "Shows pickup locations")
```

### Container Diagram

```mermaid
C4Container
    title Container Diagram - CoCreate MVP

    Person(user, "User")

    Container_Boundary(frontend, "Frontend") {
        Container(spa, "Single Page App", "HTML/JS/CSS", "Client-side rendered UI")
        Container(mockData, "Mock Data Layer", "JavaScript", "Simulates backend data")
    }

    Container_Boundary(future_backend, "Future Backend") {
        ContainerDb(db, "SQLite/PostgreSQL", "Database", "Users, Products, Orders")
        Container(api, "REST API", "Django/Node.js", "Business logic & auth")
    }

    Rel(user, spa, "Uses", "HTTPS")
    Rel(spa, mockData, "Reads/Writes")
    Rel_R(spa, api, "Future: API calls")
    Rel(api, db, "Queries")
```

### Component Diagram

```mermaid
C4Component
    title Component Diagram - Frontend Application

    Container_Boundary(frontend, "Frontend SPA") {
        Component(app, "app.js", "Router", "Page routing & state")
        Component(navbar, "Navbar.js", "Component", "Navigation & user menu")
        Component(pages, "Pages/*", "Views", "Home, Browse, Dashboard, etc.")
        Component(utils, "utils.js", "Utilities", "Auth, cart, notifications")
        Component(search, "SearchEngine.js", "Service", "Fuzzy search & ranking")
        Component(onboard, "OnboardingFlow.js", "Component", "First-visit tutorial")
        Component(help, "ContextualHelp.js", "Component", "Tooltips & FAQ sidebar")
    }

    Rel(app, navbar, "Renders")
    Rel(app, pages, "Renders based on route")
    Rel(pages, utils, "Uses")
    Rel(pages, search, "Uses for Browse")
```

---

## Technology Stack

| Layer | Current (MVP) | Proposed (Production) |
|---|---|---|
| **Frontend** | Vanilla JS, HTML, CSS | React or Next.js |
| **Styling** | Custom CSS | Tailwind CSS or CSS Modules |
| **State** | Global `AppState` object | Redux / Zustand |
| **Backend** | Mock data (JS objects) | Django REST Framework or Node.js |
| **Database** | localStorage / SQLite (seeded) | PostgreSQL |
| **Auth** | Mock login | JWT + OAuth (Google) |
| **Payments** | Mock | Stripe Connect |
| **Deployment** | Static hosting | Vercel / Railway / AWS |

---

## Composable Architecture Principles

The codebase follows these principles for maintainability:

1. **Separation of Concerns**: Pages, components, utilities, and data are in separate directories.
2. **Single Responsibility**: Each JS file handles one feature (e.g., `SearchEngine.js` only does search).
3. **Stateless Components**: Most render functions take data as input and return HTML strings.
4. **Global State**: `AppState` object in `mockData.js` serves as a simple store.
5. **Event-Driven UI**: `onclick` handlers call global functions that update state and re-render.

**Migration Path**: Replace `renderXPage()` functions with React components; `AppState` → Redux store.

---

## Backend Integration Plan

### Option A: Django + DRF
- **Pros**: Python ecosystem, admin panel, ORM, rapid development.
- **Cons**: Separate frontend deployment, learning curve for JS devs.
- **Use When**: Team prefers Python; need robust admin tools.

### Option B: Node.js + Express
- **Pros**: Same language as frontend, easy to share code, fast.
- **Cons**: Less batteries-included than Django.
- **Use When**: Team prefers JS; need real-time features (Socket.io).

### Recommended: Start with Django
- Use Django REST Framework for API.
- Use Django Admin for seller verification.
- Deploy frontend on Vercel, backend on Railway.

---

## Deployment Strategy

```
┌─────────────────┐      ┌─────────────────┐
│   Vercel        │      │   Railway       │
│   (Frontend)    │ ──→  │   (Django API)  │
│   Static SPA    │      │   PostgreSQL    │
└─────────────────┘      └─────────────────┘
         │                        │
         └────────────────────────┘
                   ↓
         ┌─────────────────┐
         │   Stripe        │
         │   (Payments)    │
         └─────────────────┘
```

### Environment Setup
- **Development**: `python3 -m http.server 8000` (current)
- **Staging**: Vercel preview deployments
- **Production**: Vercel (frontend) + Railway (backend)

---

## Future Features

See [FUTURE_FEATURES.md](file:///Users/thd/Documents/CoCreate/FUTURE_FEATURES.md) for detailed roadmap including:
- Photo metadata verification
- Real-time messaging (WebSockets)
- Advanced analytics dashboard
- Mobile app (React Native)
