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
      jsTypeMapping: null,
    }
  },
  mounted() {
    this.analysis = this.$store.getters.getAnalysis
    this.jsTypeMapping = this.$store.getters.getJsTypeMapping
  },
  methods: {
    calculate() {
      let result = ''
      if (this.analysis?.columns) {
        result = this.analysis.columns.reduce((previous, current, index) => {
          if (current.isNull) {
            return (
              previous +
              `@IsOptional()
${current.field}: ${this.jsTypeMapping[current.type]}

`
            )
          } else {
            return (
              previous +
              `@IsNotEmpty()
${current.field}: ${this.jsTypeMapping[current.type]}

`
            )
          }
        }, '')
      }
      return result
    },
  },
}
</script>

<style></style>
