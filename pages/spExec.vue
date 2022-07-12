<template>
  <div>
    <div class="container">
      <div class="mh-100">
        <b-form
          @submit.prevent="onSubmit"
          class="d-flex flex-column justify-content-space-around align-item-center my-4"
        >
          <b-form-group id="fieldset-1" label="Yours" label-for="textarea">
            <b-form-textarea
              id="textarea"
              :value="calculate()"
              placeholder="..."
              rows="20"
              class="my-4"
            ></b-form-textarea>
          </b-form-group>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      analysis: null,
      mssqlTypeMapping: null,
    }
  },
  mounted() {
    this.analysis = this.$store.getters.getAnalysis
    this.mssqlTypeMapping = this.$store.getters.getMssqlTypeMapping
  },
  methods: {
    calculate() {
      let result = ''
      if (this.analysis?.columns) {
        // required
        result += `const payload = [
`
        result += this.analysis.columns.reduce((previous, current) => {
          if (current.field === 'createdAt' || current.field === 'updatedAt') {
            return previous
          } else if (!current.isNull) {
            return (
              previous +
              `     {
          name: '_${current.field}',
          type: sql.${this.mssqlTypeMapping[current.type]},
          value: dto.${current.field},
      },
`
            )
          } else {
            return previous
          }
        }, '')
        result += `]

`

        // optional
        result += this.analysis.columns.reduce((previous, current) => {
          if (current.isNull) {
            return (
              previous +
              `if(dto.${current.field} || (!dto.${
                current.field
              } && (Number(dto.${current.field}) === 0 || dto.${
                current.field
              } === ''))) {
  payload.push({
    name: '_${current.field}',
    type: sql.${this.mssqlTypeMapping[current.type]},
    value: dto.${current.field},
  })
}
`
            )
          } else {
            return previous
          }
        }, '')
      }
      // end if
      return result
    },
  },
}
</script>

<style></style>
