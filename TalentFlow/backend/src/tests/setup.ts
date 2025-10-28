// Jest setup file
import 'reflect-metadata';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock axios for external requests
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock cheerio
jest.mock('cheerio', () => ({
  load: jest.fn(() => ({
    text: jest.fn(() => ''),
    find: jest.fn(() => ({
      text: jest.fn(() => ''),
      first: jest.fn(() => ({
        text: jest.fn(() => ''),
      })),
    })),
  })),
}));
