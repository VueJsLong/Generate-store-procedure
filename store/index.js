import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      analysis: null,
      jsTypeMapping: {
        varchar: 'string',
        nvarchar: 'string',
        tinyint: 'number',
        int: 'number',
        bigint: 'number',
        datetime: 'string',
      },
      mssqlTypeMapping: {
        varchar: 'VarChar',
        nvarchar: 'NVarChar',
        tinyint: 'TinyInt',
        int: 'Int',
        bigint: 'BigInt',
        datetime: 'Date',
      },
    },
    mutations: {
      setAnalysis(state, analysis) {
        state.analysis = analysis
      },
    },
    actions: {
      setAnalysis(vuexContext, analysis) {
        vuexContext.commit('setAnalysis', analysis)
      },
    },
    getters: {
      getAnalysis(state) {
        return state.analysis
      },
      getJsTypeMapping(state) {
        return state.jsTypeMapping
      },
      getMssqlTypeMapping(state) {
        return state.mssqlTypeMapping
      },
    },
  })
}

export default createStore
