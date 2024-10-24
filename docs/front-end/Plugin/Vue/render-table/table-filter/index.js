import TrTableFilter from './TrTableFilter.vue'

const plugin = TrTableFilter

plugin.install = function install(app) {
  app.component(TrTableFilter.name, TrTableFilter)
}

export * from './filters'
export * from './utils'

export default plugin
