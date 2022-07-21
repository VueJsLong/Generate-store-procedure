<template>
  <div class="container">
    <b-row>
      <b-col sm="12" md="4">
        <b-form-group
          :label="`Primary key: ${analysis.primary}`"
          v-slot="{ ariaDescribedby }"
        >
          <b-form-radio
            v-for="(column, index) in analysis.columns"
            :key="index"
            v-model="analysis.primary"
            :aria-describedby="ariaDescribedby"
            :value="column.field"
            >{{ column.field }}</b-form-radio
          >
        </b-form-group>
      </b-col>
      <b-col sm="12" md="4">
        <b-form-group
          :label="`Unique key: ${analysis.unique}`"
          v-slot="{ ariaDescribedby }"
        >
          <b-form-checkbox
            v-for="(column, index) in analysis.columns"
            :key="index"
            v-model="analysis.unique"
            :aria-describedby="ariaDescribedby"
            :value="column.field"
            >{{ column.field }}</b-form-checkbox
          >
        </b-form-group>
      </b-col>
      <b-col sm="12" md="4">
        <b-form-group
          :label="`Table action: ${analysis.action}`"
          v-slot="{ ariaDescribedby }"
        >
          <b-form-radio
            v-for="(item, index) in ['CREATE', 'ALTER']"
            :key="index"
            v-model="analysis.action"
            :aria-describedby="ariaDescribedby"
            :value="item"
            >{{ item }}</b-form-radio
          >
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      analysis: {
        action: 'CREATE',
        schema: '',
        table: '',
        primary: '',
        unique: [],
        columns: [],
      },
    }
  },
  watch: {
    'analysis.unique'() {
      this.$store.commit('setAnalysis', this.analysis)
    },
    'analysis.primary'() {
      this.$store.commit('setAnalysis', this.analysis)
    },
    '$store.state.analysis'() {
      if (this.$store.getters.getAnalysis) {
        this.analysis = this.$store.getters.getAnalysis
      }
    },
  },
  mounted() {
    if (this.$store.getters.getAnalysis) {
      this.analysis = this.$store.getters.getAnalysis
    }
  },
}
</script>

<style></style>
