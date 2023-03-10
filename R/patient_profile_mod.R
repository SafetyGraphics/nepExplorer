#' Patient Profile Module UI
#'
#' @param id module id
#'
#' @return returns shiny module UI
#' @import shiny
#' @importFrom plotly plotlyOutput
patientProfileUI <-  function(id) {
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
#' @param settings settings object with column mappings
#' @param subj_id single subject ID as character string
#'
#' @return returns shiny server module
#' @import shiny
#' @import dplyr
#' @importFrom plotly renderPlotly
#' @importFrom magrittr %>%
patientProfileServer <-  function(id, df, settings, subj_id) {
  moduleServer(
    id,
    function(input, output, session) {
      patient_df <- df %>%   # filter to selected patient
        filter(.data[[settings$id_col]] == subj_id)

      ## TO DO: pass settings object into charts and use names from there in dplyr etc
      output$demo_table <- render_gt({
        drawDemoTable(adlb = patient_df, settings = settings,
                      demo_vars = c(settings$id_col, settings$age_col, settings$sex_col,
                                    settings$race_col, settings$treatment_col))
      })

      output$percent_change <- renderPlotly({
        drawPercentChange(adlb = patient_df,
                          labs = c(settings$measure_values$Creatinine, settings$measure_values$`Cystatin C`),
                          settings = settings)
      })

      output$raw_change <- renderPlotly({
        drawRawChange(adlb = patient_df, settings = settings,
                      labs = c(settings$measure_values$Creatinine, settings$measure_values$`Cystatin C`), 
                      delta_creatinine_ref_ranges = TRUE)
      })
      
      output$raw_change_egfr <- renderPlotly({
        drawRawChange(adlb = patient_df, settings = settings,
                      labs = c(settings$measure_values$eGFR, settings$measure_values$eGFRcys),
                      delta_creatinine_ref_ranges = FALSE)
      })
      
      output$ULN_FC <- renderPlotly({
        drawULNFoldChange(adlb = patient_df, settings = settings,
                          labs = c(settings$measure_values$Bicarbonate, settings$measure_values$`Blood Urea Nitrogen`,
                                                                settings$measure_values$Calcium,
                                   settings$measure_values$Chloride, settings$measure_values$Phosphorus, 
                                   settings$measure_values$Potassium, settings$measure_values$Sodium))
      })
      
      output$blood_pressure <- renderPlotly({
        drawBloodPressure(adlb = patient_df, settings = settings, 
                          labs = c(settings$measure_values$`Diastolic Blood Pressure`, 
                                   settings$measure_values$`Systolic Blood Pressure`))
      })
      
      output$normalized_albumin <- renderPlotly({
        drawNormalizedAlbumin(adlb = patient_df, settings = settings)
      })
      
      
    }
  )
}
