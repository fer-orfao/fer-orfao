# PlantCare AI

Aplicación web para registrar plantas, hacer seguimiento de riegos y obtener un diagnóstico simulado por foto.

## Requisitos

- [Node.js](https://nodejs.org) versión 18 o superior
- [VS Code](https://code.visualstudio.com) (recomendado) o cualquier editor

## Instalación y ejecución local

1. Descarga y descomprime el proyecto.
2. Abre la carpeta del proyecto en VS Code (Archivo > Abrir carpeta).
3. Abre la terminal integrada de VS Code (Terminal > Nueva terminal).
4. Instala las dependencias:

   ```bash
   npm install
   ```

5. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

6. Abre en tu navegador la URL que aparece en la terminal (normalmente `http://localhost:5173`).

## Scripts disponibles

| Comando           | Descripción                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo          |
| `npm run build`   | Compila el proyecto para producción       |
| `npm run preview` | Previsualiza la versión de producción     |
| `npm run typecheck` | Verifica los tipos de TypeScript        |
| `npm run lint`    | Ejecuta el linter                         |

## Estructura del proyecto

```
src/
├── App.tsx                  # Componente principal con navegación por pestañas
├── main.tsx                 # Punto de entrada de React
├── index.css                # Estilos globales y Tailwind
├── components/
│   ├── AddPlantForm.tsx     # Formulario de registro de plantas
│   ├── PlantDashboard.tsx   # Panel con lista de plantas y estado de riego
│   └── PhotoDiagnosis.tsx   # Carga de foto y diagnóstico simulado
├── lib/
│   ├── supabase.ts          # Cliente de Supabase
│   └── plantUtils.ts        # Lógica de cálculo de riego
└── types/
    └── plant.ts             # Tipos de TypeScript
```

## Base de datos

El proyecto usa Supabase como backend. Las variables de conexión ya están configuradas en el archivo `.env` incluido en la descarga:

```
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=...
```

La tabla `plants` se crea automáticamente con la migración incluida en `supabase/migrations/`.

## Extensiones recomendadas para VS Code

Al abrir el proyecto, VS Code sugerirá automáticamente instalar:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Next

Acepta las recomendaciones para tener autocompletado, formato automático y resaltado de Tailwind CSS.
