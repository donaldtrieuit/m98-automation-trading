import { createGlobalStyle } from 'styled-components';
/// Style
import './index.less';
import './custom-style.less';
import './custom-styles-antd.less';

import { lightThemeVariables, darkThemeVariables, commonThemeVariables } from './themes/themeVariables';

export default createGlobalStyle`

  [data-theme='light'],
  :root {
    ${lightThemeVariables}
  }

  [data-theme='dark'] {
    ${darkThemeVariables}
  }

  :root {
    ${commonThemeVariables};
  }

  [data-no-transition] * {
    transition: none !important;
  }
`;
