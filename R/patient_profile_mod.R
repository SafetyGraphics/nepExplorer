#' Patient Profile Module UI
#'
#' @param id module id
#'
#' @return returns shiny module UI
#' 
#' @import shiny
#' @importFrom plotly plotlyOutput
#' 
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

#' Patient Profile Module Server
#'
#' @param id module id
#' @param df lab dataset in tall format with creatinine lab
#' @param subjid single subject ID as character string
#'
#' @return returns shiny server module
#' 
#' @import shiny
#' @import dplyr
#' @importFrom plotly renderPlotly
#' @importFrom magrittr %>%
#' 
patientProfileServer <-  function(id, df, subj_id) {
  moduleServer(
    id,
    function(input, output, session) {
      
      patient_df <- df %>%   # filter to selected patient
        filter(USUBJID == subj_id) 
      
      output$demo_table <- render_gt({
        drawDemoTable(patient_df)
      })
      
      output$percent_change <- renderPlotly({
        drawPercentChange(patient_df)
      })
      
      output$raw_change <- renderPlotly({
        drawRawChange(patient_df)
      })
      
      output$raw_change_egfr <- renderPlotly({
        drawRawChange(patient_df, labs = c("eGFR", "eGFRcys"), delta_creatinine_reference_ranges = FALSE)
      })
      
      output$ULN_FC <- renderPlotly({
        drawULNFoldChange(patient_df)
      })
      
      output$blood_pressure <- renderPlotly({
        drawBloodPressure(patient_df)
      })
      
      output$normalized_albumin <- renderPlotly({
        drawNormalizedAlbumin(patient_df)
      })
      
      
    }
  )
}