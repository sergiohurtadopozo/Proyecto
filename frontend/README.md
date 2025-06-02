# 📅 Gestor de Tareas - Proyecto Fullstack

**Gestor de Tareas** es una aplicación web moderna y responsive para la gestión personal y colaborativa de tareas, con panel de usuario y panel de administrador. Permite crear, editar, compartir y visualizar tareas en un calendario, con notificaciones in-app y control de acceso por roles.

---

## 🚀 Características principales

- **Autenticación segura** (login, registro, recuperación de contraseña)
- **Gestión de tareas**: crear, editar, eliminar, marcar como completadas
- **Tareas compartidas**: comparte tareas con otros usuarios y gestiona solicitudes
- **Calendario interactivo**: visualiza tus tareas y las compartidas, con símbolos diferenciadores
- **Notificaciones in-app**: aviso cuando una tarea está próxima a vencer
- **Panel de administración**: estadísticas, gestión global de tareas y usuarios
- **Diseño responsive**: experiencia óptima en móvil, tablet y escritorio
- **Accesibilidad y UX**: formularios claros, mensajes de error amigables, navegación fluida

---

## 🖥️ Tecnologías utilizadas

- **Frontend:** React, React Router, Context API, CSS Modules
- **Backend:** Node.js, Express, Sequelize, JWT (no incluido aquí)
- **Base de datos:** PostgreSQL / MySQL (según configuración backend)
- **Estilos:** CSS moderno, media queries, diseño mobile-first

---

## 📦 Estructura del proyecto

```
/frontend
  ├── src/
  │   ├── components/         # Componentes React (Navbar, Dashboard, TaskForm, etc.)
  │   ├── context/            # Contextos globales (Auth, Tasks)
  │   ├── estilos/            # Archivos CSS por componente y globales
  │   ├── services/           # Servicios para llamadas a la API
  │   ├── App.jsx             # Enrutador principal
  │   └── index.js            # Punto de entrada
  └── public/
```

---

## ⚡ Instalación y ejecución

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/gestor-tareas.git
   cd gestor-tareas/frontend
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   - Crea un archivo `.env` y define la URL de tu backend:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```

4. **Inicia la aplicación:**
   ```bash
   npm start
   ```
   La app estará disponible en [http://localhost:3000](http://localhost:3000)

---

## 📝 Uso básico

- **Registro/Login:** Crea una cuenta o inicia sesión.
- **Gestión de tareas:** Crea, edita y elimina tareas desde el dashboard.
- **Calendario:** Visualiza tus tareas y las compartidas, con símbolos diferenciadores.
- **Notificaciones:** Recibe avisos cuando una tarea está próxima a vencer.
- **Panel de admin:** Si eres administrador, accede a estadísticas y gestión global.

---

## 📱 Responsive y accesibilidad

- El diseño se adapta automáticamente a cualquier dispositivo.
- Los botones y formularios son accesibles y fáciles de usar en móvil.
- Sin scroll horizontal, fuentes y colores legibles.

---

## 🛡️ Seguridad

- Autenticación con JWT.
- Rutas protegidas según rol (usuario/admin).
- Validación de formularios en frontend y backend.

---

## 🛠️ Personalización y mejoras

- Puedes cambiar los colores y estilos en `/src/estilos/global.css`.
- Añade nuevas funcionalidades fácilmente gracias a la estructura modular.
- Integra notificaciones push, emails reales o más roles según tus necesidades.

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas!  
Abre un issue o pull request para sugerir mejoras, reportar bugs o proponer nuevas funcionalidades.

---

## 📄 Licencia

MIT © [Tu Nombre o Usuario]
