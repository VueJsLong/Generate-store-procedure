<template>
  <div class="container">
    <div class="mh-100">
      <b-form
        @submit.prevent="onSubmit"
        class="d-flex flex-column justify-content-space-around align-item-center my-4"
      >
        <b-form-group
          id="fieldset-1"
          label="Enter your sql"
          label-for="textarea"
        >
          <b-form-textarea
            id="textarea"
            v-model="sql"
            placeholder="Enter sql..."
            rows="20"
            class="my-4"
          ></b-form-textarea>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'default',
  data() {
    return {
      sql: '',
      analysis: null,
    }
  },
  watch: {
    'analysis.unique'() {
      this.$store.commit('setAnalysis', this.analysis)
    },
    sql() {
      this.$store.commit('setSql', this.sql)
    },
  },
  mounted() {
    if (this.$store.getters.getSql) {
      this.sql = this.$store.getters.getSql
    } else {
      this.sql = `CREATE TABLE [dbo].[expert_translations](
      [expertId] [bigint] NOT NULL,
      [languageId] [bigint] NOT NULL,
      [name] [nvarchar](255) NOT NULL,
      [age] [int] NULL,
      [position] [nvarchar](255) NOT NULL,
      [active] [tinyint] NULL,
      [createdAt] [datetime] NOT NULL,
      [updatedAt] [datetime] NOT NULL,`
    }

    if (this.$store.getters.getAnalysis) {
      this.analysis = this.$store.getters.getAnalysis
    }
  },
  methods: {
    onSubmit() {
      this.setTable()
      this.setColumn()
      this.$store.commit('setAnalysis', this.analysis)
    },
    setTable() {
      let textBetween = this.sql.match(/\[(.+?)\]/g)
      this.analysis.schema = textBetween[0].slice(1, textBetween[0].length - 1)
      this.analysis.table = textBetween[1].slice(1, textBetween[1].length - 1)
    },
    setColumn() {
      let textBetween = this.sql.match(/\[(.+?)\]/g)

      // remove schema, table
      let schema, table, columns
      ;[schema, table, ...columns] = textBetween

      // slice, remove []
      columns = columns.map((column) => {
        return column.slice(1, column.length - 1)
      })

      // mapping type
      const columnsWithType = []
      for (let index = 0; index < columns.length; index++) {
        if (index % 2 == 0) {
          const field = columns[index]
          const type = columns[index + 1]
          const length = this.getColumnLength(field)
          const isNull = this.getColumnNullState(field)
          columnsWithType.push({ field, type, length, isNull })
        }
      }
      this.analysis.columns = columnsWithType
    },
    getColumnLength(field) {
      const indexOfType = this.sql.indexOf('[' + field + ']') + field.length
      const stringNextToField = this.sql.substring(
        indexOfType,
        indexOfType + 30
      )
      let lengths = stringNextToField.match(/\((.+?)\)/g)
      const result =
        lengths && lengths.length > 0
          ? Number(lengths[0].slice(1, lengths[0].length - 1))
          : 0
      return result
    },
    getColumnNullState(field) {
      const indexOfType = this.sql.indexOf('[' + field + ']') + field.length
      const stringNextToField = this.sql.substring(
        indexOfType,
        indexOfType + 30
      )
      console.log(field, stringNextToField)
      let indexOfNotNull = stringNextToField.indexOf('NOT NULL')
      return indexOfNotNull > 0 ? false : true
    },
  },
}
</script>

<style>
body {
  background-color: #eee;
}
</style>
