// jest.setup.mjs
import jestExpect from './jestExpect.cjs';
globalThis.expect = jestExpect;
import '@testing-library/jest-dom';
