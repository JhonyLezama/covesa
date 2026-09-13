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
| Diseño público | shadcn/ui (button, badge, card, tabs, select, carousel Embla) + lucide |
| Editor texto | Tiptap (blog) |
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
php artisan storage:link
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

## Modelo de datos

16 tablas en orden de dependencia: `property_types`, `zones`, `statuses` (genérica por
`type`), `users` (+ Spatie), `projects`, `project_translations`, `properties`,
`property_translations`, `blog_posts`, `blog_translations`, `referrals`, `leads`,
`media` (polimórfica — única vía para imágenes), `settings`, `ui_translations`.

> `leads.referral_id` → `referrals.id`, por eso `referrals` migra **antes** que `leads`.
> Decisiones de negocio pendientes (ver `// TODO` en el código, no resolver sin el cliente):
> traducción de propiedades (`Property`, `PropertyTranslation`) y `commission_percentage`
> (`Referral` — el form acepta % editable, compatible con fijo o reglas futuras).

### Usuarios de prueba (password: `password`)

| Email | Rol | Permisos |
|---|---|---|
| `admin@covesa.com` | admin | manage-users, manage-content, manage-settings, manage-leads, manage-own-leads |
| `editor@covesa.com` | editor | manage-content |
| `maria.contreras@covesa.com` | comercial | manage-own-leads |

## CMS (`/admin/*`, auth manual sin Breeze)

Login en `/login` (sin registro público). Todo `/admin/*` exige `auth`; cada controlador
autoriza por Policy (`manage-users`, `manage-content`, `manage-leads`/`manage-own-leads`).
El comercial solo ve sus leads/propiedades asignadas y sus referidos; el editor no entra
a leads/referidos ni a usuarios.

| Área | Ruta | Notas |
|---|---|---|
| Dashboard | `/admin` | |
| Usuarios | `/admin/usuarios` | Solo admin. Foto 512px, toggle activo (no borrado físico), anti auto-baja |
| Propiedades | `/admin/propiedades` | Slug auto, tags `ideal_for`, galería (portada, orden, borrado en duro — ver `Media`) |
| Proyectos | `/admin/proyectos` | Traducción ES en transacción, detalle con asociadas |
| Blog | `/admin/blog` | Categoría string + datalist, Tiptap, galería |
| Leads | `/admin/leads` | Sin creación manual (nacen en Semana 6). Reasigna solo admin; estado admin o dueño |
| Referidos | `/admin/referidos` | Comisión auto (`monto × % / 100`, solo admin), leads generados |

## Sitio público

`PublicLayout` (header blanco logo centrado, footer 4 columnas desde `settings`, badges
El Milagro/Hanan + WhatsApp flotantes) con Montserrat — el admin sigue en Inter.
Rutas: `/` (buscador: tab, tipo, lugar, propósito→`ideal_for`, precio; 6 destacadas),
`/proyectos/{slug}` (landing mínima; la completa es Semana 5).
Diseño portado de `.int/web/code.html` (local, no versionado) según PDF.
`/demo-diseno` es temporal para aprobación visual — retirar antes de producción.

## Paleta

Oficial: navy `#0C447C`, gold `#F2A623`, grises. `brand` es alias de navy-light `#1A5A9E`.
Excepciones aprobadas: verde El Milagro `#2F8F4E`, WhatsApp `#25D366`.
Regla: tonos del PDF se estiman al aprobado más cercano; color nuevo solo con aprobación.

## Estado

- [x] Semana 2: CMS núcleo (auth, usuarios, propiedades, galería, home real)
- [x] Semana 3: proyectos, blog, leads, referidos (73 tests)
- [x] Semana 4 (días 1–5): diseño público shadcn + portado HTML (77 tests, 577 assertions)
- [ ] Semana 5: landings de proyecto + ficha pública de propiedad completas
- [ ] Semana 6: formularios públicos → leads (contacto hoy solo va al log)
- [ ] Semana 7: multiidioma (selector de idioma hoy visual)

## Convenciones

- Gestor JS: **pnpm** (`packageManager` fijado en `package.json`).
- `composer.json`/`composer.lock` alineados a **PHP 8.2**.
- `QUEUE_CONNECTION=database` en local (Redis recién en el VPS).
- Referencia `.int/` (PDF, HTML, imágenes) es **local y no se versiona**.
