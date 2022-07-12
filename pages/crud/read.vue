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
${this.analysis.action} PROCEDURE [${this.analysis.schema}].[CMS_${
          this.analysis.table
        }_getAll]
	-- Add the parameters for the stored procedure here
  ${this.getParams()}
	@_page int = 1,
	@_rowPerPage int = 50,
	@_totalRow int out
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF @_page is null or @_page = 0
		SET @_page = 1
	IF @_rowPerPage is null OR @_rowPerPage = 0  
		SET @_rowPerPage = 50

    -- Insert statements for procedure here
	SELECT * INTO #tempResult
	FROM [${this.analysis.schema}].[${this.analysis.table}]
	WHERE ${this.getWhereCondition()}

	SET @_totalRow = (select count(1) from #tempResult)

	IF @_totalRow is null
		SET @_totalRow = 0

	SELECT * FROM #tempResult 
	ORDER BY createdAt DESC
	OFFSET @_rowPerPage * (@_page - 1) ROWS
	FETCH NEXT @_rowPerPage ROWS ONLY;
	
	DROP TABLE #tempResult;
END
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
        } else {
          return (
            prev +
            `
        @_${curr.field} ${curr.type}${
              curr.length ? '(' + curr.length + ')' : ''
            } = null,`
          )
        }
      }, '')
      return result
    },
    getWhereCondition() {
      let result = ''
      result += this.analysis.columns.reduce((prev, curr) => {
        if (
          curr.field === this.analysis.primary ||
          curr.field === 'createdAt' ||
          curr.field === 'updatedAt'
        ) {
          return prev + ''
        } else
          return (
            prev +
            `(ISNULL(@_${curr.field}, '') = '' OR ${curr.field} LIKE CONCAT('%', @_${curr.field}, '%')) AND
          `
          )
      }, '')
      return result.slice(0, result.length - 15)
    },
  },
}
</script>

<style></style>
