# Ambiental-ia-v1.1

## Descripción

Ambiental-ia-v1.1 es una aplicación de escritorio desarrollada con Electron que funciona como asistente especializado en ingeniería hidráulica y ambiental. Permite realizar consultas técnicas sobre normativa, licencias y estudios de impacto ambiental en Uruguay, citando legislación vigente cuando es posible.

## Características

- Interfaz moderna y responsiva.
- Consulta a modelos de IA (OpenAI y DeepSeek) mediante API Key.
- Historial de consultas y respuestas.
- Cambio de tema (oscuro/claro).
- Menú contextual con funciones de copiar, pegar y seleccionar todo.
- Video de fondo y diseño visual atractivo.
- Soporte para copiar código y respuestas técnicas.
- Configuración de proveedor y API Key desde la interfaz.

## Instalación y ejecución

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**

   ```bash
   npm start
   ```

3. **Empaquetar la aplicación**

   ```bash
   npm run dist
   ```

   El instalador se generará en la carpeta `dist`.

## Estructura del proyecto

```
AMBIENTAL-IA-V1.1/
│
├── index.html
├── package.json
├── README.md
├── src/
│   ├── main.js
│   ├── preload.js
│   ├── js/
│   │   └── open-deep.js
│   ├── css/
│   │   ├── icons.css
│   │   ├── history.css
│   │   ├── styles.css
│   │   └── responsive.css
│   ├── img/
│   │   ├── icon.ico
│   │   ├── ambiental-ia-1.png
│   │   └── logo-a.png
│   └── video/
│       └── background.mp4
```

## Configuración de API Key

- Selecciona el proveedor (OpenAI o DeepSeek) en la interfaz.
- Ingresa tu API Key y presiona "Guardar".
- La clave se almacena localmente y se utiliza para las consultas.

## Requisitos

- Node.js 18 o superior.
- Cuenta y API Key de OpenAI o DeepSeek.

## Licencia

ISC

## Autor

Willans Junes

## Enlaces

- [Repositorio en GitHub](https://github.com/Algoritmos-uy/AMBIENTAL-IA-V1.1)
- [Sitio web](https://www.algoritmos.uy)
