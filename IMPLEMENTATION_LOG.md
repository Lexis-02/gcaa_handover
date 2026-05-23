# GCAA Handover — Implementation Log

Track successes and failures so we can move faster. **Update this file on every major change or completed task.**

---

## How to use

| Section | When to add an entry |
|---------|----------------------|
| **Successes** | Feature works, tests pass, deployed behavior confirmed |
| **Failures** | Blocked, reverted, bug found, approach abandoned (note why) |
| **In progress** | Current sprint / active work (remove when done) |

---

## In progress

- _(none — pick next feature below)_

---

## Successes

| Date | Item | Notes |
|------|------|-------|
| 2026-05-23 | Users & roles seeded | Spatie: 6 roles, 16 permissions, 7 demo users (`UserSeeder`) |
| 2026-05-23 | Auth stack | Fortify + username login, 2FA, passkeys, invitation-gated registration |
| 2026-05-23 | Base app shell | Inertia + React sidebar layout, placeholder dashboard, theme tokens in `app.css` |
| 2026-05-23 | Department scoping | `DepartmentScope` on `PcAsset` for director / end_user |
| 2026-05-23 | Central brand theme | `resources/css/brand.css` — edit `--brand-primary` etc. once; whole UI updates |
| 2026-05-23 | Role-based dashboard | `DashboardController` + `DashboardService`; KPIs/pipeline scoped by role + `DepartmentScope` |
| 2026-05-23 | Shared layout, role routing | Single `AppLayout`; `/dashboard` resolves primary role via `config/dashboard.php` priority |
| 2026-05-23 | Role-aware sidebar | `config/navigation.php` filtered by permissions; badges for pending stages |
| 2026-05-23 | Shopeers-inspired UI | KPI cards, pipeline bar, gauge, weekly activity, insight card, recent table |
| 2026-05-23 | Dashboard tests | 5 feature tests passing (`DashboardTest`) |
| 2026-05-23 | Sidebar refresh | Black sidebar, `logo.png`, new nav links, removed blue promo card |
| 2026-05-23 | Dashboard cleared | Header only; cards removed for later sprint |
| 2026-05-23 | Sidebar UX upgrade | Navy background, roomier padding, CRUD dropdowns (Add/View/Edit), framer-motion + date-fns |
| 2026-05-23 | Brand refresh `#0393D9` | Sidebar sky blue, complementary palette in `brand.css`, fill-hover buttons, custom scrollbar |
| 2026-05-23 | App header toolbar | Search (Ctrl+K), notifications, theme toggle, Welcome user; dashboard cleared |
| 2026-05-23 | Browser tab + logo | Title "PC Handover", favicon `/assets/logo.png` |

---

## Failures / lessons

| Date | Item | What went wrong | Next time |
|------|------|-----------------|----------|
| 2026-05-23 | PHPUnit without Vite build | 500: manifest missing `dashboard/index.tsx` | Run `npm run build` after adding Inertia pages, or add `WithoutVite` in tests |

---

## Dashboard & theme (this sprint)

| Task | Status |
|------|--------|
| Central brand tokens (`resources/css/brand.css`) — change one place | Done |
| Role-based `/dashboard` route + `DashboardController` | Done |
| Per-role dashboard UI (single `AppLayout`) | Done |
| Share `roles`, `permissions`, `navigation` to frontend | Done |
| Role-aware sidebar navigation | Done |

---

## Role → dashboard mapping

| Role | Dashboard focus |
|------|-----------------|
| `super_admin` | System-wide KPIs, pipeline, audit overview |
| `ict_admin` | Batches, PC inventory, stage management |
| `stores_officer` | Stage 1 sign-offs, forms |
| `director` | Department handovers, Stage 2 approvals |
| `end_user` | My assigned PC, Stage 3, old PC return |
| `auditor` | Read-only compliance & activity |

---

## Quick reference

- **Theme:** `resources/css/brand.css` → imported by `resources/css/app.css`
- **Dashboard config:** `config/dashboard.php`
- **Nav config:** `config/navigation.php`
- **Controller:** `app/Http/Controllers/DashboardController.php`
- **Stats:** `app/Services/DashboardService.php`
- **Page:** `resources/js/pages/dashboard/index.tsx`
