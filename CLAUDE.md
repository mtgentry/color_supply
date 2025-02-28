# Color Supply Code Guidelines

## Build Commands
- `npm run dev`: Run development server
- `npm run build`: Build for production
- `npm run generate`: Generate static site
- `npm run preview`: Preview production build

## Project Structure
- Nuxt 3 application with Vue 3 components
- Pug templates for most Vue components
- Sass/SCSS for styling with variables

## Code Style
- Vue SFC (Single File Components) with <template>, <script setup>, <style>
- Pug for templates with indentation for nesting
- Component naming: PascalCase (e.g., NavBar.vue)
- Composables use camelCase (e.g., hexToHSL.js)
- Vuetify used for UI components
- Pinia for state management with composable-style stores

## Data Flow
- Pinia stores for global state management
- Vue refs for component state
- Composables for shared logic
- Auth handled via @sidebase/nuxt-auth

## Styling
- Scoped Sass for component styles
- CSS variables for theme colors (--color1, --color2, etc.)
- Variables defined in assets/css/variables.scss