// babel.config.js
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 현재 디렉토리의 경로를 가져옵니다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  presets: [
    '@babel/preset-env', // 최신 JavaScript 기능을 지원하는 프리셋
  ],
  plugins: [
     '@babel/plugin-transform-modules-commonjs'
  ],
};
