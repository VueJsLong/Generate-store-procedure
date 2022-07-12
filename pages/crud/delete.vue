<template>
  <div>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      analysis: {},
    }
  },
  mounted() {
    this.analysis = this.$store.getters.getAnalysis
  },
  methods: {
    calculate() {
      let result = ''
      if (this.analysis?.columns) {
        result += `SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
${this.analysis.action} PROCEDURE [${this.analysis.schema}].[CMS_${this.analysis.table}_delete] 
	-- parameters
	@_${this.analysis.primary} bigInt, 
	@_Return int out
AS 
BEGIN TRY
	IF NOT EXISTS (SELECT TOP(1) 1 FROM [${this.analysis.schema}].[${this.analysis.table}] WHERE ${this.analysis.primary} = @_${this.analysis.primary})
	BEGIN
		SET @_Return = -3; -- Khônng ton tai
		RETURN
	END

	-- Delete by id
	DELETE FROM [${this.analysis.schema}].[${this.analysis.table}] WHERE ${this.analysis.primary} = @_${this.analysis.primary};

	SET @_Return = 1;
END TRY
BEGIN CATCH
	SET @_Return = -11;
	EXECUTE [dbo].[SP_LogError];
END CATCH;
GO
        `
      }
      return result
    },
  },
}
</script>

<style></style>
