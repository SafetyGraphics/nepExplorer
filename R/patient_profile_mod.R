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
      
      #grab settings from each domain
      dm_settings <- settings$dm
      lab_settings <- settings$labs
      vitals_settings <- settings$vitals
      
      # filter to selected patient
      patient_df <- df %>%
        filter(.data[[dm_settings$id_col]] == subj_id)
      
      ## TO DO: pass settings object into charts and use names from there in dplyr etc
      output$demo_table <- render_gt({
        drawDemoTable(adlb = patient_df, settings = dm_settings,
                      demo_vars = c(dm_settings$id_col, dm_settings$age_col, dm_settings$sex_col,
                                    dm_settings$race_col, dm_settings$treatment_col))
      })

      output$percent_change <- renderUI({

       default_labs <- c(lab_settings$measure_values$CREAT, lab_settings$measure_values$CYSTC)
       available_labs <- intersect(patient_df[[lab_settings$measure_col]] %>%  unique(), default_labs)
     
        if (length(available_labs) > 0) {
            drawPercentChange(adlb = patient_df,
                              labs = available_labs,
                              settings = lab_settings)
        } else {
          div()
        }
      })

      output$raw_change <- renderUI({

        default_labs <- c(lab_settings$measure_values$CREAT, lab_settings$measure_values$CYSTC)
        available_labs <- intersect(patient_df[[lab_settings$measure_col]] %>%  unique(), default_labs)

        if (length(available_labs) > 0) {
          drawRawChange(adlb = patient_df, settings = lab_settings,
                        labs = available_labs,
                        delta_creatinine_ref_ranges = TRUE)
        } else {
          div()
        }
      })

      output$raw_change_egfr <- renderUI({

        default_labs <- c(lab_settings$measure_values$eGFR, lab_settings$measure_values$eGFRcys)
        available_labs <- intersect(patient_df[[lab_settings$measure_col]] %>%  unique(), default_labs)

        if (length(available_labs) > 0) {
          drawRawChange(adlb = patient_df, settings = lab_settings,
                        labs = available_labs,
                        delta_creatinine_ref_ranges = FALSE)
        } else {
          div()
        }
      })

      output$ULN_FC <- renderUI({

        default_labs <-  c(lab_settings$measure_values$BICARB,
                           lab_settings$measure_values$BUN,
                           lab_settings$measure_values$CA,
                           lab_settings$measure_values$CL,
                           lab_settings$measure_values$PHOS,
                           lab_settings$measure_values$K,
                           lab_settings$measure_values$SODIUM)

        available_labs <- intersect(patient_df[[lab_settings$measure_col]] %>%  unique(), default_labs)

        if (length(available_labs) > 0) {
          drawULNFoldChange(adlb = patient_df, settings = lab_settings,
                            labs = available_labs)
        } else {
          div()
        }
      })

      output$blood_pressure <- renderUI({

        default_vitals <- c(vitals_settings$measure_values$DIABP,
                          vitals_settings$measure_values$SYSBP)

        available_vitals <- intersect(patient_df[[vitals_settings$measure_col]] %>%  unique(), default_vitals)

        if (length(available_vitals) > 0) {
          drawBloodPressure(adlb = patient_df, settings = vitals_settings,
                        labs = available_vitals)
        } else {
          div()
        }
      })

      output$normalized_albumin <- renderUI({

        if (length(lab_settings$measure_values[["ALB/CREAT"]] %in%
                   patient_df[[lab_settings$measure_col]] %>%  unique()) > 0) {
          drawNormalizedAlbumin(adlb = patient_df, settings = lab_settings)
        } else {
          div()
        }
      })

    }
  )
}
