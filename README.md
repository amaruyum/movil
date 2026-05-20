# 🎬 listCine — App de Gestión de Películas

Aplicación móvil multiplataforma desarrollada con **React Native + Expo** para gestionar una colección personal de películas. Desarrollada como actividad académica del módulo de **Desarrollo de Aplicaciones Multiplataforma**.

---

## 📱 Capturas de pantalla

> La app cuenta con una interfaz oscura inspirada en el cine, con tonos rojos y negros.

---

## ✨ Funcionalidades

| Función | Descripción |
|---|---|
| 📋 **Listado** | Lista scrollable con búsqueda en tiempo real por título o director |
| ➕ **Crear** | Modal con formulario completo y validación de campos |
| ✏️ **Editar** | Pantalla de edición con vista previa en tiempo real |
| 🗑️ **Eliminar** | Borrado con diálogo de confirmación |
| ⭐ **Puntuación** | Selector numérico del 1 al 10 |
| ✅ **Estado** | Marca películas como vistas o pendientes |
| 📊 **Estadísticas** | Métricas de la colección: media, géneros, director favorito |
| 🔍 **Búsqueda** | Filtrado en tiempo real por título o director |
| 💾 **Persistencia** | Datos guardados localmente en SQLite |

---

## 🏗️ Arquitectura

```
listCine-app/
├── app/                          # Pantallas (Expo Router)
│   ├── _layout.tsx               # Root Stack + inicialización SQLite
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab Navigator (3 pestañas)
│   │   ├── index.tsx             # 🎬 Listado de películas
│   │   ├── estadisticas.tsx      # 📊 Estadísticas de la colección
│   │   └── acercaDe.tsx          # ℹ️ Información de la app
│   └── movie/
│       ├── nueva.tsx             # ➕ Crear película (modal)
│       └── [id].tsx              # ✏️ Editar película (stack)
├── components/                   # Componentes reutilizables
│   ├── MovieCard.tsx             # Tarjeta de película (Lista + Editar)
│   ├── EmptyState.tsx            # Estado vacío (Lista + Estadísticas)
│   └── CampoFormulario.tsx       # Input de formulario (Crear + Editar)
├── hooks/
│   └── usePeliculas.ts           # 🪝 Hook personalizado (estado + CRUD)
├── database/
│   └── database.ts               # 💾 Módulo SQLite (tipos + queries)
├── constants/
│   └── Colors.ts                 # 🎨 Paleta de colores + géneros
└── plugins/
    └── withAndroidGradle.js      # Plugin de configuración Android
```

---

## ✅ Requisitos de la actividad cumplidos

### Requisitos técnicos

| Requisito | Implementación |
|---|---|
| **Expo Router** | Stack + Tabs configurados con 5 pantallas |
| **Al menos 3 interfaces** | Lista · Estadísticas · Acerca de · Crear · Editar |
| **Componente reutilizable (≥2 pantallas)** | `MovieCard` → Lista + Editar · `EmptyState` → Lista + Stats · `CampoFormulario` → Crear + Editar |
| **Hook personalizado** | `usePeliculas` — estado reactivo + CRUD completo |
| **SQLite** | `expo-sqlite` con módulo centralizado |

### Requisitos de calidad

| Criterio | Implementación |
|---|---|
| **camelCase** | Todas las variables, props y funciones |
| **Nombres significativos** | `actualizarCampo`, `confirmarEliminacion`, `distribucionGeneros`... |
| **Componentes nombrados** | `PantallaListado`, `MovieCard`, `EmptyState`, `TarjetaStat`... |
| **Comentarios JSDoc** | En todos los componentes, hooks y funciones de BD |
| **Modularización** | `database/`, `hooks/`, `components/`, `constants/` |

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| **React Native** | 0.74.x | Framework móvil multiplataforma |
| **Expo** | ~54.0.0 | Toolchain y librerías nativas |
| **Expo Router** | ~3.5.0 | Navegación file-based (Stack + Tabs) |
| **expo-sqlite** | ~13.4.0 | Persistencia local SQLite |
| **TypeScript** | ~5.3.3 | Tipado estático |
| **@expo/vector-icons** | ^14.0.4 | Iconos (Ionicons) |

---

## 🗄️ Esquema de base de datos

```sql
CREATE TABLE peliculas (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo         TEXT    NOT NULL,
  director       TEXT    NOT NULL,
  anio           INTEGER NOT NULL,
  genero         TEXT    NOT NULL,
  puntuacion     REAL    NOT NULL DEFAULT 5,   -- Rango: 1-10
  sinopsis       TEXT    NOT NULL DEFAULT '',
  vista          INTEGER NOT NULL DEFAULT 0,   -- 0=pendiente, 1=vista
  fechaAgregada  TEXT    NOT NULL              -- ISO 8601
);
```

---

## 🧩 Componentes reutilizables

### `MovieCard`
Tarjeta visual que muestra la información de una película con franja lateral de color según estado, chips de género y puntuación con estrella.

**Usado en:** `app/(tabs)/index.tsx` · `app/movie/[id].tsx`

### `EmptyState`
Pantalla de estado vacío con icono, título, subtítulo y botón de acción opcional.

**Usado en:** `app/(tabs)/index.tsx` · `app/(tabs)/estadisticas.tsx` · `app/(tabs)/acercaDe.tsx`

### `CampoFormulario`
Wrapper de `TextInput` con etiqueta, borde de foco dinámico y mensajes de validación.

**Usado en:** `app/movie/nueva.tsx` · `app/movie/[id].tsx`

---

## 🪝 Hook personalizado — `usePeliculas`

Encapsula toda la lógica de negocio de las películas. Los componentes nunca acceden directamente a la base de datos.

```typescript
const {
  peliculas,          // Lista reactiva de películas
  cargando,           // Estado de carga
  textoBusqueda,      // Filtro de búsqueda activo
  recargarPeliculas,  // Recarga desde SQLite
  buscar,             // Actualiza el filtro de búsqueda
  limpiarBusqueda,    // Limpia el filtro
  agregarPelicula,    // INSERT + recarga
  editarPelicula,     // UPDATE + recarga
  borrarPelicula,     // DELETE + recarga
  obtenerPelicula,    // SELECT by ID
} = usePeliculas();
```

---

## 🚀 Instalación y ejecución

### Prerrequisitos
- Node.js 18+
- Expo Go en tu dispositivo móvil
- O Android Studio con un emulador configurado

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/amaruyum/listCine-app.git
cd listCine-app

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Iniciar el servidor de desarrollo
npx expo start --clear

# 4. Abrir en el emulador Android
# Pulsa 'a' en el terminal

# 5. O escanear el QR con Expo Go en tu móvil
```

---

## 📐 Flujo de navegación

```
Root Stack (_layout.tsx)
│
├── Tabs ((tabs)/_layout.tsx)
│   ├── 🎬 index.tsx          → Lista de películas
│   ├── 📊 estadisticas.tsx   → Estadísticas
│   └── ℹ️  acercaDe.tsx      → Acerca de
│
└── Stack (movie/)
    ├── nueva.tsx             → Modal: crear película
    └── [id].tsx              → Editar película
```

---

## 🎨 Paleta de colores

| Color | Hex | Uso |
|---|---|---|
| Background | `#0D0D0D` | Fondo principal |
| Surface | `#1A1A1A` | Tarjetas y modales |
| Accent | `#E5383B` | Color primario (rojo cine) |
| Success | `#4CAF50` | Películas vistas |
| Star | `#FFD700` | Puntuación |
| Text Primary | `#F5F5F5` | Texto principal |

---

## 👥 Créditos

Desarrollado como **Actividad 2** del módulo de Desarrollo de Aplicaciones Multiplataforma.

© 2024 — Todos los derechos reservados.
