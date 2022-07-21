import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      sql: null,
      analysis: {
        action: 'CREATE',
        schema: '',
        table: '',
        primary: '',
        unique: [],
        columns: [],
      },
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
      setSql(state, sql) {
        state.sql = sql
      },
    },
    actions: {
      setAnalysis(vuexContext, analysis) {
        vuexContext.commit('setAnalysis', analysis)
      },
      setSql(vuexContext, sql) {
        vuexContext.commit('setSql', sql)
      },
    },
    getters: {
      getSql(state) {
        return state.sql
      },
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
