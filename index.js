import RenderTable from './index.vue'

const plugin = RenderTable

plugin.install = function install(app) {
  app.component(RenderTable.name, RenderTable)
}

export default plugin
