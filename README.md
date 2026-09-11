# COVESA — Inmobiliaria & Constructora

Monolito **Laravel + Inertia.js + React** para el sitio público de COVESA y su CMS interno
(propiedades, proyectos, leads, referidos y blog). Más de 35 años de experiencia en el
mercado inmobiliario peruano.

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Laravel 12 (PHP 8.2) |
| Frontend | React 18 + TypeScript + Tailwind CSS v4 (Vite 7) |
| Puente | Inertia.js v3 + Ziggy (rutas Laravel en React) |
| BD local | MySQL (XAMPP) · Tests en SQLite `:memory:` |
| Roles | Spatie Permission v6 (`admin`, `editor`, `comercial`) |
| Imágenes | Intervention Image v3 |
| Paquetes JS | `pnpm` (no npm) |

## Requisitos

- PHP 8.2 + extensiones (`mbstring`, `gd`, `pdo_mysql`, `xml`, `curl`, `zip`)
- MySQL corriendo (XAMPP) con la BD `covesa` creada (`utf8mb4_unicode_ci`)
- Composer 2 + Node 22 + `pnpm` 10

## Instalación (desde cero)

```powershell
git clone https://github.com/JhonyLezama/covesa.git
cd covesa

composer install
Copy-Item .env.example .env   # ajustar DB_* según tu MySQL
php artisan key:generate

pnpm install
php artisan migrate:fresh --seed
```

`.env` mínimo para MySQL local:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=covesa
DB_USERNAME=root
DB_PASSWORD=
```

## Desarrollo

Se necesitan **dos terminales** (Laravel sirve la página, Vite los assets React):

```powershell
# Terminal 1 — backend
php artisan serve          # http://127.0.0.1:8000

# Terminal 2 — frontend
pnpm dev
```

## Scripts

```powershell
pnpm dev        # Vite en modo desarrollo
pnpm build      # typecheck + build de producción (public/build)
pnpm preview    # previsualizar el build
pnpm typecheck  # tsc --noEmit
php artisan test
```

## Modelo de datos (Día 1-2)

16 tablas en orden de dependencia: `property_types`, `zones`, `statuses` (genérica por
`type`), `users` (+ Spatie), `projects`, `project_translations`, `properties`,
`property_translations`, `blog_posts`, `blog_translations`, `referrals`, `leads`,
`media` (polimórfica — única vía para imágenes, no hay `featured_image`/`gallery`),
`settings`, `ui_translations`.

> `leads.referral_id` → `referrals.id`, por eso `referrals` migra **antes** que `leads`.
> Pendientes de negocio marcados con `// TODO` en `Property`, `PropertyTranslation`
> y `Referral` (traducción de propiedades, `commission_percentage`).

### Usuarios de prueba (password: `password`)

| Email | Rol |
|---|---|
| `admin@covesa.com` | admin |
| `editor@covesa.com` | editor |
| `maria.contreras@covesa.com` | comercial (Broker corporativo) |

## Estructura del frontend (`resources/js/`)

```
Pages/        # Páginas Inertia (Home, …)
Components/   # UI reutilizable (Header, Hero, PropertyCard, ContactForm, …)
Layouts/      # AppLayout (Header + Footer)
types.ts      # Tipos compartidos (Property, …)
app.tsx       # Entry Inertia + Vite
```

Las rutas nombradas (`home`, `contacto.store`) se usan en React vía `route()` (Ziggy).

## Convenciones

- Gestor JS: **pnpm** (`packageManager` fijado en `package.json`).
- `composer.json`/`composer.lock` alineados a **PHP 8.2** (el VPS/staging también debe
  usar 8.2; Spatie v6 e Intervention v3 son las versiones compatibles).
- `QUEUE_CONNECTION=database` en local (Redis recién en el VPS).

## Estado / siguiente paso

- [x] Setup + modelo físico + seeders + tests (8/8 en verde)
- [ ] Validación de catálogos con el cliente (freno acordado)
- [ ] Semana 2: CMS núcleo (login manual Inertia + CRUD)
