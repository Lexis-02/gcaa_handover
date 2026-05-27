# GCAA Handover — Implementation Log

Track successes and failures so we can move faster. **Update this file on every major change or completed task.**







## How to use

| Section | When to add an entry |
|---------|----------------------|
| **Successes** | Feature works, tests pass, deployed behavior confirmed |
| **Failures** | Blocked, reverted, bug found, approach abandoned (note why) |
| **In progress** | Current sprint / active work (remove when done) |


## In progress

- _(none — pick next feature below)_

---

## Successes

| Date | Item | Notes |
|------|------|-------|
| 2026-05-23 | Users & roles seeded | Spatie: 6 roles, 16 permissions, 7 demo users (`UserSeeder`) |
| 2026-05-23 | Auth stack | Fortify + username login, passkeys; **registration is invitation-only** (signed URLs) |
| 2026-05-23 | Base app shell | Inertia + React sidebar layout, theme tokens in `brand.css` |
| 2026-05-23 | Department scoping | `DepartmentScope` on `PcAsset` for director / end_user |
| 2026-05-23 | Central brand theme | `resources/css/brand.css` — primary scale 50–900 + semantic colors |
| 2026-05-23 | Role-based dashboard | `DashboardController` + `DashboardService`; KPIs/pipeline scoped by role |
| 2026-05-23 | Shared layout, role routing | Single `AppLayout`; `/dashboard` resolves primary role via `config/dashboard.php` |
| 2026-05-23 | Role-aware sidebar | `config/navigation.php` filtered by permissions; badges for pending stages |
| 2026-05-23 | Sidebar UX | Navy/sky brand sidebar, CRUD dropdowns, framer-motion; **collapsed flyout** via portal (`nav-collapsible-item.tsx`) |
| 2026-05-23 | App header toolbar | Search (Ctrl+K), notifications bell, theme toggle, welcome user |
| 2026-05-23 | Browser tab + logo | Title "PC Handover", favicon `/assets/logo.png`; sidebar logo scaled up |
| 2026-05-23 | Profile page | `/profile` — view/edit name, username, email; user menu link |
| 2026-05-23 | 2FA removed | Fortify 2FA disabled; columns dropped; UI removed from settings/security |
| 2026-05-23 | Appearance settings removed | Theme toggle stays in user menu only (light/dark/system) |
| 2026-05-23 | Dashboard (full) | KPI cards, pipeline panel, completion donut, activity chart, date filter (`?from`/`?to`), quick links; tests in `DashboardTest` |
| 2026-05-23 | Handover notifications | DB notifications (`HandoverActionRequired`); `/notifications` page; bell + poll API |
| 2026-05-23 | Notification sound alerts | Web Audio triple beep; poll every **3s**; reminder every **2 min** if unread; login beep if unread on sign-in; sound on/off on notifications page; `use-handover-notification-alerts.ts` |
| 2026-05-23 | User management | CRUD: list (search + pagination), show, create, edit; `UserManagementService`; `users.manage` permission |
| 2026-05-23 | Registration invitation links | `user_invitations` table; signed `/register/{invitation}`; role/dept on register; admin UI at `/users/invitations`; nav under Users |
| 2026-05-23 | Custom error pages | Inertia `errors/not-found` for 403/404/500/503; GCAA branding; `bootstrap/app.php` handler |
| 2026-05-23 | PC handover UI | Slim table, searchable PC picker (`pc-asset-combobox`), old-PC return flow |
| 2026-05-23 | Secondary button contrast | `brand.css` + button tokens; search actions use primary variant where needed |

---

## Failures / lessons

| Date | Item | What went wrong | Next time |
|------|------|-----------------|----------|
| 2026-05-23 | PHPUnit without Vite build | 500: manifest missing Inertia page | Run `npm run build` after adding pages, or `WithoutVite` in tests |
| 2026-05-23 | `user_invitations` migration | Full `php artisan migrate` failed on unrelated `old_pc_returns` (`condition` reserved word) | Run targeted migration: `php artisan migrate --path=database/migrations/2026_05_23_140000_create_user_invitations_table.php` |
| 2026-05-23 | Fortify default `/register` | Conflict with signed invitation routes | Disable `Features::registration()` in `config/fortify.php`; use `RegisterInvitationController` only |
| 2026-05-23 | Notification sound repeat | Poll returned all unread when `since` invalid → beep every 20s | Require valid `since` id; track played ids in `sessionStorage` |
| 2026-05-23 | Browser autoplay | No sound until user clicks once | Unlock Web Audio on first click/keydown; login alert after gesture |
| 2026-05-23 | Collapsed sidebar submenus | `SidebarMenuSub` hidden in icon mode + `overflow-hidden` | Flyout via `createPortal` + fixed position in `nav-collapsible-item.tsx` |
| 2026-05-23 | Dashboard date filter | `Carbon::parse(Stringable)` TypeError on Laravel 13 | Cast request input: `(string) $request->input('from')` |

---

## Notification sound — behaviour reference

| Trigger | Timing |
|---------|--------|
| New alert while logged in | ~**3 seconds** (poll interval) |
| Reminder while still unread | Every **2 minutes** |
| Unread waiting on sign-in | **Once** per login, after first click/keypress |
| Sound muted | Never (toggle on `/notifications`) |
| User not logged in | No sound (alerts stored in DB until login) |

**Config (frontend):** `POLL_MS`, `REMINDER_MS` in `resources/js/hooks/use-handover-notification-alerts.ts`  
**Volume:** `PEAK_GAIN` in `resources/js/lib/handover-alert-sound.ts`

---

## Notification records — what creates an alert

| Event | Who is notified |
|-------|-----------------|
| New PC registered (pending) | Stores officers (`stage1.signoff`) |
| After each stage sign-off | Next stage signers (stores / director dept / end user) |
| Stage 3 done, old PC not returned | End user + stores (`old-pc.submit` / `stage1.signoff`) |

Not notified: faulty-on-arrival PCs, batch/user admin actions, sign-off confirmations to other parties.

---

## User & registration — routes

| Route | Purpose |
|-------|---------|
| `GET /users` | User list + search |
| `GET /users/invitations` | Generate/revoke registration links |
| `POST /users/invitations` | Create signed invitation |
| `GET /register/{invitation}?signature=…` | Self-registration (one-time, expires) |
| `GET /register` | Redirects to `/login` (no open registration) |

**Backend:** `UserInvitationService`, `UserInvitation` model, `EnsureValidInvitation` middleware  
**Config:** `config/invitations.php` (`expiry_days` default 7)

---

## Role → dashboard mapping

| Role | Dashboard focus |
|------|-----------------|
| `super_admin` | System-wide KPIs, users, config |
| `ict_admin` | Batches, PC register, pipeline |
| `stores_officer` | Stage 1 sign-offs, notifications |
| `director` | Department handovers, Stage 2 |
| `end_user` | My PC, Stage 3, old PC return |
| `auditor` | Read-only compliance |

---

## Quick reference

| Area | Location |
|------|----------|
| Theme | `resources/css/brand.css` |
| Dashboard | `config/dashboard.php`, `app/Services/DashboardService.php`, `resources/js/pages/dashboard/` |
| Navigation | `config/navigation.php` |
| Notifications | `app/Services/HandoverNotificationService.php`, `resources/js/pages/notifications/` |
| Sound | `resources/js/lib/handover-alert-sound.ts`, `resources/js/hooks/use-handover-notification-alerts.ts` |
| Users | `app/Http/Controllers/UserController.php`, `resources/js/pages/users/` |
| Invitations | `app/Http/Controllers/UserInvitationController.php`, `resources/js/pages/users/invitations/` |
| Errors | `resources/js/pages/errors/not-found.tsx`, `bootstrap/app.php` |
| Handover config | `config/handover.php` |
| Tests | `tests/Feature/DashboardTest.php`, `HandoverNotificationTest.php`, `UserManagementTest.php`, `NotFoundPageTest.php` |

---

## Demo users (seeded)

| Username | Role |
|----------|------|
| `ictadmin` | ICT admin |
| `storesofficer` | Stores officer |
| `director_hr` | Director |
| `enduser` | End user |
| `auditor` | Auditor |
| `superadmin` | Super admin (if seeded) |

Passwords per `UserSeeder` / project README.
