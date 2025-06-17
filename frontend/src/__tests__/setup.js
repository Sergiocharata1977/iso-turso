// Configuración global para Jest
import 'jest-environment-jsdom';

// Mock de variables de entorno
process.env.VITE_API_BASE_URL = 'http://localhost:3002/api';

// Mock global de fetch si no está disponible
if (!global.fetch) {
  global.fetch = jest.fn();
}

// Mock de import.meta.env para Vite
global.import = global.import || {};
global.import.meta = global.import.meta || {};
global.import.meta.env = global.import.meta.env || {};
global.import.meta.env.VITE_API_BASE_URL = 'http://localhost:3002/api';
global.import.meta.env.VITE_TURSO_DATABASE_URL = 'test_db_url';
global.import.meta.env.VITE_TURSO_AUTH_TOKEN = 'test_token';

// Configuración adicional para jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock de ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Suprimir warnings de console en las pruebas
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
