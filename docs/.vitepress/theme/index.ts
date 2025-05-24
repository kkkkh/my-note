// .vitepress/theme/index.ts
// #region theme
import { EnhanceAppContext } from 'vitepress'
import Viewer from 'v-viewer'
import { directive as viewer } from "v-viewer"
import DefaultTheme from 'vitepress/theme'
Viewer.setDefaults({
  // zoomable: false,
  zoomRatio: 1.2,
})
export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }: EnhanceAppContext) {
    app.directive('viewer', viewer());
    // app.use(Viewer);
  }
}
// #endregion theme
