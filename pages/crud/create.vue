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
        result += `
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
${this.analysis.action} PROCEDURE [dbo].[CMS_${this.analysis.table}_insert]
	-- parameters
	${this.getParams()}
	@_Return int out
AS
BEGIN TRY
  -- Check unique
  ${this.getCheckExist()}
  
	-- Insert into [${this.analysis.schema}].[${this.analysis.table}] 
	INSERT INTO [${this.analysis.schema}].[${this.analysis.table}] 
		(${this.getInsertField()}) 
	VALUES 
		(${this.getInsertValue()});
	
	SET @_Return = 1;
END TRY
BEGIN CATCH
	SET @_Return = -1;
	EXECUTE [dbo].[SP_LogError];
END CATCH;
GO
`
      }
      return result
    },
    getParams() {
      let result = ''
      result += this.analysis.columns.reduce((prev, curr) => {
        if (
          curr.field === this.analysis.primary ||
          curr.field === 'createdAt' ||
          curr.field === 'updatedAt'
        ) {
          return prev
        } else if (curr.isNull) {
          return (
            prev +
            `
        @_${curr.field} ${curr.type}${
              curr.length ? '(' + curr.length + ')' : ''
            } = null,`
          )
        } else {
          return (
            prev +
            `
        @_${curr.field} ${curr.type}${
              curr.length ? '(' + curr.length + ')' : ''
            },`
          )
        }
      }, '')
      return result
    },
    getCheckExist() {
      let result = ''
      if (this.analysis?.unique) {
        result += this.analysis.unique.reduce((prev, curr) => {
          return (
            prev +
            `IF EXISTS (SELECT TOP(1) 1 FROM [${this.analysis.schema}].[${this.analysis.table}] WHERE [${curr}] = @_${curr})
      BEGIN
        SET @_Return = -2; -- Da ton tai
        RETURN
      END
  `
          )
        }, '')
      }
      return result
    },
    getInsertField() {
      let result = ''
      result += this.analysis.columns.reduce((prev, curr, index) => {
        if (curr.field === this.analysis.primary) {
          return ''
        } else {
          return prev + curr.field + ', '
        }
      }, '')
      return result.slice(0, result.length - 2)
    },
    getInsertValue() {
      let result = ''
      result += this.analysis.columns.reduce((prev, curr) => {
        if (curr.field === this.analysis.primary) {
          return ''
        } else if (curr.field === 'createdAt' || curr.field === 'updatedAt') {
          return prev + 'GETDATE(), '
        } else return prev + '@_' + curr.field + ', '
      }, '')
      return result.slice(0, result.length - 2)
    },
  },
}
</script>

<style></style>
