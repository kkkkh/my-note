// .vitepress/theme/index.ts
// #region theme
import { EnhanceAppContext } from 'vitepress'
import Viewer from 'v-viewer'
import { directive as viewer } from "v-viewer"
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { h } from 'vue'
import GiscusComments from './components/GiscusComments.vue'

Viewer.setDefaults({
  // zoomable: false,
  zoomRatio: 1.2,
})
export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(GiscusComments)
    })
  },
  enhanceApp({ app, router, siteData }: EnhanceAppContext) {
    app.directive('viewer', viewer());
    app.component('GiscusComments', GiscusComments)
    // app.use(Viewer);
  }

}
// #endregion theme
