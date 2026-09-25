# CI/CD y Deploy en Render 🚀

Bienvenido/a. En esta clase vas a aprender a hacer que tu código se pruebe y se publique **solo**, cada vez que hagas un push. Nada de subir archivos a mano ni cruzar los dedos.

Esta guía sirve sin importar qué plantilla usaste para armar tu proyecto (Lovable, un starter propio, `create-vite`, etc.) — el Diagnostico de tu proyecto te va a decir qué camino seguir.


## Antes de arrancar

Piensa en una cocina de restaurante con varios cocineros.

- **Sin CI/CD:** cada cocinero cocina en su casa y una vez por semana traen todo junto. Si algo no combina, te enterás recién frente al cliente.
- **CI** es un supervisor parado en la puerta de la cocina, probando cada plato apenas sale. Si algo está mal, no pasa — se corrige ahí mismo, antes de llegar a la mesa.
- **CD** es el mozo automático: en cuanto el supervisor aprueba, el plato ya está en la mesa. Nadie lo carga a mano.

> **Frase para quedarte con la idea:** CI pregunta *"¿esto funciona?"* — CD responde *"entonces ya está en producción."*


## ¿Qué vas a necesitar?

- Una cuenta de [GitHub](https://github.com)
- Una cuenta de [Render](https://render.com)
- Tu proyecto ya en un repositorio de GitHub (no importa qué plantilla usaste para crearlo)


## Diagnostica tu proyecto

**Este paso es obligatorio antes de tocar Render.** No todas las plantillas generan el mismo tipo de build, y eso cambia cómo se publica.

Corre esto en tu terminal:

```bash
npm install
npm run build
```

Mira con atención qué pasó y elegí tu camino:

### 🟢 Camino A — Sitio estático (SPA)

Tu terminal muestra algo simple tipo `✓ built in Xms` y aparece una carpeta **`dist/`** (o `build/`) con archivos `.html`, `.js` y `.css` sueltos adentro. No hay ninguna mención a un servidor.

Esto es lo más común en un proyecto de React + Vite "puro", sin routing con SSR. **Anda directo al [Camino A](#-camino-a--deploy-como-static-site) más abajo.**

### 🔵 Camino B — App con servidor (SSR)

Tu terminal muestra mensajes como `Generated .output/server/...`, `Using auto generated worker name`, `npx nitro deploy`, o aparece una carpeta **`.output/`** con subcarpetas `server/` y `public/` en vez de `dist/`.

Esto pasa si tu plantilla usa un framework full-stack con Server-Side Rendering — por ejemplo **TanStack Start**, Next.js, Remix, Nuxt, SvelteKit, etc. (Es lo que trae por defecto la plantilla de Lovable basada en TanStack Start.) Estas apps no son "archivos sueltos", son un **servidor** que hay que correr. **Anda directo al [Camino B](#-camino-b--deploy-como-web-service-ssr) más abajo.**

> 💡 Si no estás segurx cuál te tocó: abrí `package.json` y fijate si en `dependencies` o `devDependencies` aparece `nitro`, `@tanstack/react-start`, `next`, `@remix-run/*`, `nuxt` o `@sveltejs/kit`. Si aparece alguno de esos, es Camino B.

Si esto falla directamente (ni siquiera termina), arreglalo antes de seguir — un build roto local va a fallar también en CI y en Render.


## Paso 1 — Publicar con un Blueprint de Render

En vez de configurar todo a mano en el dashboard, vamos a describir el deploy en un archivo. Así queda versionado junto con tu código, sin importar el camino que elijas.

### 🟢 Camino A — Deploy como Static Site

Creá `render.yaml` en la **raíz** del repo:

```yaml
services:
  - type: web
    runtime: static
    name: mi-app
    buildCommand: npm ci && npm run build
    staticPublishPath: dist   # o "build", según lo que viste en el Paso 0
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

### 🔵 Camino B — Deploy como Web Service (SSR)

Acá no publicás archivos, publicás un **servidor** que Render mantiene corriendo. Si tu proyecto usa Nitro (como TanStack Start) hay un preset pensado específicamente para Render: `render-com`.

Creá `render.yaml` en la **raíz** del repo:

```yaml
services:
  - type: web
    runtime: node
    name: mi-app
    buildCommand: npm ci && npm run build
    startCommand: node .output/server/index.mjs
    envVars:
      - key: NITRO_PRESET
        value: render-com
```

Notas para este camino:

- La variable `NITRO_PRESET` le dice a Nitro que genere el servidor para Render, no para Cloudflare (que suele ser el destino por defecto en plantillas como la de Lovable).
- Si tu plantilla **no** usa Nitro (por ejemplo es Next.js), el `startCommand` cambia — típicamente `next start` para Next.js. Preguntá si tenés dudas con tu caso puntual antes de la clase.
- No necesitás definir el puerto: Render lo inyecta solo y el servidor lo toma de la variable de entorno `PORT`.

### Pasos para ambos caminos

1. Commiteá y pusheá el `render.yaml` a `main`.
2. En Render: **New → Blueprint**.
3. Conectá tu repositorio de GitHub.
4. Render lee el archivo, te muestra qué va a crear, y con un click en **Apply** lo publica.

✅ En este punto ya tenés **CD**: cada push a `main` va a redeployar el sitio solo. Pero todavía no hay ningún chequeo antes de publicar — cualquier error llega directo a producción.


## Paso 2 — Agregar CI con GitHub Actions

Ahora vamos a poner al "supervisor" en la puerta, antes de que algo llegue a `main`. Este workflow es **igual para los dos caminos** — el chequeo es el mismo `npm run build`, no importa qué genere.

Creá el archivo `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  build-and-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

Esto le dice a GitHub: "cada vez que alguien abra un PR o pushee a `main`, instalá las dependencias, corré el linter y probá que el build funcione."


## Paso 3 — La demo: atrapar un error antes de que llegue a producción

Este es el momento clave de la clase.

1. Creá una rama nueva:
   ```bash
   git checkout -b demo-error
   ```
2. Rompé algo a propósito. Por ejemplo, en un componente que usa `count`, cambiá:
   ```ts
   const [count, setCount] = useState(0)
   ```
   por:
   ```ts
   const [count, setCount] = useState("cero")
   ```
   (esto rompe cualquier lugar donde después se haga `count + 1` — funciona igual en Camino A o B, es un error de tipo en un componente, no del sistema de build)
3. Subí la rama y abrí un Pull Request contra `main`:
   ```bash
   git push origin demo-error
   ```
4. Mirá el check de GitHub Actions en el PR — va a fallar en rojo. **El error se frenó acá, no llegó a producción.**
5. Corregí el error, hacé push de nuevo al mismo PR, y mirá cómo el check pasa a verde.
6. Mergeá el PR a `main`.
7. Andá a Render y mirá cómo se dispara el deploy automáticamente, apenas se detecta el push a `main`.


## ✅ Checklist de lo que lograste

- [ ] Identifiqué si mi proyecto es Camino A (estático) o Camino B (SSR)
- [ ] Tengo un `render.yaml` en la raíz de mi repo, adaptado a mi camino
- [ ] Mi sitio se publicó en Render vía Blueprint
- [ ] Tengo un workflow de CI en `.github/workflows/ci.yml`
- [ ] Abrí un PR con un error intencional y vi el check fallar
- [ ] Corregí el error, vi el check pasar, y mergeé
- [ ] Vi el deploy automático dispararse en Render después del merge


## Para repasar

| Concepto | Qué hace | En esta clase |
|---|---|---|
| **CI** | Prueba el código automáticamente antes de que se integre | GitHub Actions (`ci.yml`) |
| **CD** | Publica el código automáticamente después de que pasó los chequeos | Render (Blueprint) |
| **Blueprint** | Describe tu infraestructura de deploy como código, versionado en el repo | `render.yaml` |
| **Static Site** | Publica archivos sueltos (`dist/`) en un CDN | Camino A |
| **Web Service** | Corre un servidor Node en vivo (para apps con SSR) | Camino B |

Si alguien te pregunta para qué sirve todo esto, ya sabés la respuesta corta:

> **CI atrapa errores antes de que se mezclen con el resto del código. CD elimina el paso manual de "subir esto a producción". Juntos, hacen que pasar de "cambié una línea" a "está en vivo" sea rápido, repetible y seguro.**