#' Run the core NepExplorer App
#'
#' @param data datasets to be loaded in to the app. Sample nepExplorer data used
#'   by default
#' @param mapping list specifying the initial mapping values for each data
#'   mapping for each domain (e.g. list(aes= list(id_col='USUBJID',
#'   seq_col='AESEQ')).
#' @param runNow Should the shiny app object created be run directly? Helpful
#'   when writing  functions to dispatch to shinyapps, rsconnect, or shinyproxy.
#'
#' @import shiny
#'
#' @export
create_nepexplorer_app <- function(
    data = list(dm = nepExplorer::adsl,
                labs = nepExplorer::adlb,
                vitals = nepExplorer::advs
                ),
    mapping = NULL,
    runNow = TRUE
) {
if (is.null(mapping)) {
    mapping <- list(labs = list("id_col" = "USUBJID", "measure_col" = "PARAM",
                               "measure_values" = list("CREAT" = "Creatinine",
                                                       "CYSTC" = "Cystatin C",
                                                       "eGFR" = "eGFR",
                                                       "eGFRcys" = "eGFRcys",
                                                       "ALB/CREAT" = "Albumin/Creatinine",
                                                       "BICARB" =  "Bicarbonate",
                                                       "BUN" =  "Blood Urea Nitrogen",
                                                       "CA" = "Calcium",
                                                       "CL" = "Chloride",
                                                       "PHOS" = "Phosphorus",
                                                       "K" = "Potassium",
                                                       "SODIUM" =  "Sodium"
                                                       ),
                               "value_col" = "STRESN",
                               "unit_col" = "STRESU",
                               "studyday_col" = "DY",
                               "visit_col" = "VISIT",
                               "visitn_col" = "VISITN",
                               "baseline_flag" = "BLFL",
                               "normal_col_high" = "STNRHI",
                               "id_col" = "USUBJID",
                               "age_col" = "AGE",
                               "sex_col" = "SEX",
                               "race_col" = "RACE",
                               "treatment_col" = "ARM"
                               ),

                    dm = list("id_col" = "USUBJID", "treatment_col" = "ARM"),

                    vitals = list("id_col" = "USUBJID", "treatment_col" = "ARM", "measure_col" = "PARAM",
                                  "measure_values" = list("DIABP" = "Diastolic Blood Pressure",
                                                          "SYSBP" = "Systolic Blood Pressure"
                                                          )
                                  )
    )
  }
  ## create object containing data and setting to pass to server
  params <- reactive({
    list(
      data = data,
      settings = mapping
    )
  })

  app <- shinyApp(
    ui =  fluidPage(nepexplorer_ui("nep")),
    server = function(input, output, session) {
      callModule(nepexplorer_server, "nep", params)
    }
  )

  if (runNow)
    runApp(app)
  else
    app
}
