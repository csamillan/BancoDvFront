# 🌐 Proyecto Frontend - Angular 18

Este es un proyecto frontend desarrollado con **Angular 18**, que consume servicios de una API REST construida en .NET Core.

## 📋 Requisitos

- [Node.js v20+](https://nodejs.org/)
- [Angular CLI 18.x](https://angular.io/cli)
- `npm` como gestor de paquetes

## ⚙️ Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/csamillan/BancoDvFront.git
   cd BancoDvFront
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura el archivo de entorno (`src/environments/environment.ts`):
   ```ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api' // URL del backend
   };
   ```

4. Levanta la aplicación en modo desarrollo:
   ```bash
   ng serve
   ```

   La app estará disponible en: [http://localhost:4200](http://localhost:4200)

