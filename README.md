# Simulador Beca BCP / ESAN

App web estática mobile-first que genera ensayos de opción múltiple (A–E) desde `docs/preguntas/` (28 temáticas · 140 preguntas), con puntaje configurable y resultados por área.

## Comandos

```bash
npm run dev     # desarrollo (genera datos + sirve con Vite)
npm run build   # build de producción a dist/
npm run preview # sirve dist/ localmente
npm run test    # pruebas Vitest (lógica pura)
npm run check   # verificación de tipos (svelte-check)
```

## Deploy

> Se completa en el Plan 08. Deploy manual del usuario en Cloudflare Pages (`npm run build` → `dist/`).

## Docs

- Especificaciones: [`docs/especificaciones/`](docs/especificaciones/README.md)
- Planes de ejecución: [`docs/plans/`](docs/plans/README.md)
- Preguntas (fuente única, solo lectura): [`docs/preguntas/`](docs/preguntas/README.md)
