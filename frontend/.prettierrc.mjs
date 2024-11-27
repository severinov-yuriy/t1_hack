import { prettier } from '@siberiacancode/prettier';

/** @type {import('prettier').Config} */
const config = { ...prettier, jsxSingleQuote: false, trailingComma: 'all', bracketSpacing: true };
export default config;
