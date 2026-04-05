// Shapes library configuration
export const SHAPES_LIBRARY = [
  {
    id: 'text',
    label: 'Text',
    icon: '📝',
    handler: 'addTextLayer',
    description: 'Add text annotation'
  },
  {
    id: 'rect',
    label: 'Rectangle',
    icon: '▭',
    handler: 'addRectLayer',
    description: 'Add rectangular shape'
  },
  {
    id: 'circle',
    label: 'Circle',
    icon: '○',
    handler: 'addCircleLayer',
    description: 'Add circular shape'
  },
  {
    id: 'line',
    label: 'Line',
    icon: '─',
    handler: 'addLineLayer',
    description: 'Draw line'
  },
  {
    id: 'triangle',
    label: 'Triangle',
    icon: '△',
    handler: 'addTriangleLayer',
    description: 'Add triangular shape'
  }
]

// Color presets for quick selection
export const COLOR_PRESETS = [
  '#ff6600', // Orange
  '#ffd600', // Yellow
  '#00d4ff', // Cyan
  '#ff0066', // Pink
  '#00ff00', // Green
  '#ffffff', // White
  '#333333', // Dark gray
  '#000000', // Black
]

// Shape color defaults
export const DEFAULT_SHAPE_COLORS = {
  rect: 'rgba(255,102,0,0.5)',
  circle: 'rgba(255,214,0,0.7)',
  line: '#ff6600',
  triangle: 'rgba(0,212,255,0.5)',
  text: '#ffffff'
}

// Mockup templates configuration
export const MOCKUP_TEMPLATES = [
  { name: 'tshirt', label: 'T-Shirt', path: '/mockups/tshirt.png', icon: '👕' },
  { name: 'mug', label: 'Mug', path: '/mockups/mug.png', icon: '☕' },
  { name: 'hoodie', label: 'Hoodie', path: '/mockups/hoodie.png', icon: '🧥' },
  { name: 'cap', label: 'Cap', path: '/mockups/cap.png', icon: '🧢' },
]

// Brush presets
export const BRUSH_PRESETS = {
  fine: 2,
  medium: 8,
  thick: 16,
  extra: 32
}
