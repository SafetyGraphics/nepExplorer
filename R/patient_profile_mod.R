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
    uiOutput(ns("percent_change")),
    uiOutput(ns("raw_change")),
    uiOutput(ns("raw_change_egfr")),
    uiOutput(ns("ULN_FC")),
    uiOutput(ns("blood_pressure")),
    uiOutput(ns("normalized_albumin")),
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

      output$percent_change <- renderUI({

       default_labs <- c(settings$measure_values$CREAT, settings$measure_values$CYSTC)
       available_labs <- intersect(patient_df[[settings$measure_col]] %>%  unique(), default_labs)

        if (length(available_labs) > 0) {
            drawPercentChange(adlb = patient_df,
                              labs = available_labs,
                              settings = settings)
        } else {
          div()
        }
      })

      output$raw_change <- renderUI({

        default_labs <- c(settings$measure_values$CREAT, settings$measure_values$CYSTC)
        available_labs <- intersect(patient_df[[settings$measure_col]] %>%  unique(), default_labs)

        if (length(available_labs) > 0) {
          drawRawChange(adlb = patient_df, settings = settings,
                        labs = available_labs,
                        delta_creatinine_ref_ranges = TRUE)
        } else {
          div()
        }
      })

      output$raw_change_egfr <- renderUI({

        default_labs <- c(settings$measure_values$eGFR, settings$measure_values$eGFRcys)
        available_labs <- intersect(patient_df[[settings$measure_col]] %>%  unique(), default_labs)

        if (length(available_labs) > 0) {
          drawRawChange(adlb = patient_df, settings = settings,
                        labs = available_labs,
                        delta_creatinine_ref_ranges = FALSE)
        } else {
          div()
        }
      })

      output$ULN_FC <- renderUI({

        default_labs <-  c(settings$measure_values$BICARB, 
                           settings$measure_values$BUN,
                           settings$measure_values$CA,
                           settings$measure_values$CL, 
                           settings$measure_values$PHOS,
                           settings$measure_values$K, 
                           settings$measure_values$SODIUM)
        
        available_labs <- intersect(patient_df[[settings$measure_col]] %>%  unique(), default_labs)

        if (length(available_labs) > 0) {
          drawULNFoldChange(adlb = patient_df, settings = settings,
                            labs = available_labs)
        } else {
          div()
        }
      })

      output$blood_pressure <- renderUI({

        default_labs <- c(settings$measure_values$DIABP,
                          settings$measure_values$SYSBP)
        
        available_labs <- intersect(patient_df[[settings$measure_col]] %>%  unique(), default_labs)

        if (length(available_labs) > 0) {
          drawBloodPressure(adlb = patient_df, settings = settings,
                        labs = available_labs)
        } else {
          div()
        }
      })

      output$normalized_albumin <- renderUI({

        if (settings$measure_values[["Albumin/Creatinine"]] %in% patient_df[[settings$measure_col]] %>%  unique()) {
          drawNormalizedAlbumin(adlb = patient_df, settings = settings)
        } else {
          div()
        }
      })

    }
  )
}
