
patientProfileUI <-  function(id){
  ns <- NS(id)
  fluidPage(
    gt_output(ns("demo_table")),
    plotlyOutput(ns("percent_change")),
    plotlyOutput(ns("raw_change")),
    plotlyOutput(ns("raw_change_egfr")),
    plotlyOutput(ns("ULN_FC")),
    plotlyOutput(ns("blood_pressure")),
    plotlyOutput(ns("normalized_albumin")),
  )
}

patientProfileServer <-  function(df, id) {
  moduleServer(
    id,
    function(input, output, session) {
     
      
      output$demo_table <- render_gt({
        drawDemoTable(df)
      })
      
      output$percent_change <- renderPlotly({
        drawPercentChange(df)
      })
      
      output$raw_change <- renderPlotly({
        drawRawChange(df)
      })
      
      output$raw_change_egfr <- renderPlotly({
        drawRawChange(df, labs = c("eGFR", "eGFRcys"), delta_creatinine_reference_ranges = FALSE)
      })
      
      output$ULN_FC <- renderPlotly({
        drawULNFoldChange(df)
      })
      
      output$blood_pressure <- renderPlotly({
        drawBloodPressure(df)
      })
      
      output$normalized_albumin <- renderPlotly({
        drawNormalizedAlbumin(df)
      })
      
      
    }
  )
}