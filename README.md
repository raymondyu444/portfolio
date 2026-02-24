# Portfolio 2026

A modern portfolio website with an animated cloud background, built with React and Node.js.

## Design System

The project includes a comprehensive design system (`design-system.json`) that defines:

- **Colors**: Primary sky blue (#dbf2ff), cloud whites, and neutral grays
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale (xs to 3xl)
- **Effects**: Shadows, blurs, and transitions
- **Animations**: Cloud float animations
- **Breakpoints**: Responsive design breakpoints

## Features

- Animated cloud background matching Figma design
- Responsive canvas that adapts to screen size
- Smooth cloud movements using Canvas API
- Design tokens from Figma variables
- Clean component structure for future additions

## Project Structure

```
├── design-system.json          # Design system tokens
├── index.html                  # Entry HTML file
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
├── server/
│   └── index.js                # Express server
└── src/
    ├── main.jsx                # React entry point
    ├── index.css               # Global styles with CSS variables
    ├── App.jsx                 # Main app component
    ├── App.css                 # App styles
    └── components/
        ├── CloudBackground.jsx # Animated cloud background
        └── CloudBackground.css # Cloud styles
```

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the React development server:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

Run the Node.js server (optional):

```bash
npm run server
```

The API will be available at `http://localhost:5000`

### Production Build

```bash
npm run build
npm run preview
```

## Design System Usage

The design system is available in `design-system.json` and as CSS variables in `src/index.css`.

### Using CSS Variables

```css
.my-component {
  background: var(--color-blue-sky);
  padding: var(--spacing-lg);
  transition: var(--transition-base);
}
```

### Importing Design System in JavaScript

```javascript
import designSystem from '../design-system.json';

const skyColor = designSystem.colors.primary.blueSky;
```

## Adding New Components

The cloud background is just the beginning! You can add more portfolio components:

1. Create new components in `src/components/`
2. Import them in `App.jsx`
3. Use the design system tokens for consistency
4. Layer them above the background (z-index > 10)

## Design Details

This implementation faithfully recreates the Figma design:

- **Sky Color**: #dbf2ff (from Figma variable `Color/blue sky`)
- **Canvas Dimensions**: 643x298 (from Figma variables `Size/643` and `Size/298`)
- **Cloud Animation**: Smooth, slow-moving clouds with varying opacity and sizes
- **Responsive**: Scales to any screen size while maintaining design integrity

## Technologies

- **Frontend**: React 18, Vite
- **Backend**: Node.js, Express
- **Styling**: CSS with design tokens
- **Animation**: HTML5 Canvas API

## Future Enhancements

- Add hero section with your name/title
- Portfolio project cards
- Contact form
- Navigation menu
- Dark mode support
- More interactive animations

---

Built with attention to detail from Figma design. Ready to grow into a full portfolio!
