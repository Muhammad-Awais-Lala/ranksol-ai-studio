

// Fallback list of detectable items if API fetch fails
export const DEFAULT_DETECTABLE_ITEMS = [
  { name: 'Wardrobe', slug: 'wardrobe' },
  { name: 'Washroom Sinks', slug: 'washroom-sinks' },
  { name: 'Kitchen Cabinets', slug: 'kitchen-cabinets' },
  { name: 'Kitchen Counter Tops', slug: 'kitchen-counter-tops' },
  { name: 'Side Tables', slug: 'side-tables' },
  { name: 'Office Desk', slug: 'office-desk' },
  { name: 'Table Tops', slug: 'table-tops' },
  { name: 'Wall Panels', slug: 'wall-panels' },
  { name: 'Single Door Wardrobe', slug: 'single-door-wardrobe' },
  { name: 'Two Door Wardrobe', slug: 'two-door-wardrobe' },
  { name: 'Sliding Door Wardrobe', slug: 'sliding-door-wardrobe' },
  { name: 'Dressing Table', slug: 'dressing-table' },
  { name: 'Wall Panel / Decorative Panel', slug: 'wall-panel-decorative-panel' },
  { name: 'Drawer Units', slug: 'drawer-units' },
];

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const GENERATION_MODEL = import.meta.env.VITE_GENERATION_MODEL;
export const GENERATION_MODEL_PRO = import.meta.env.VITE_GENERATION_MODEL_PRO;

export const DEFAULT_COLOR = '#F37021'; // RankSol Orange
