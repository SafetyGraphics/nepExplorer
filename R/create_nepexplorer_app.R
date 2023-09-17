#' Run the core NepExplorer App
#'
#' @param lab_df lab dataset to be loaded in to the app. Sample adbds data used
#'   by default
#' @param settings list specifying the initial mapping values for each data
#'   mapping for each domain (e.g. list(aes= list(id_col='USUBJID',
#'   seq_col='AESEQ')).
#' @param runNow Should the shiny app object created be run directly? Helpful
#'   when writing  functions to dispatch to shinyapps, rsconnect, or shinyproxy.
#'
#' @import shiny
#'
#' @export
create_nepexplorer_app <- function(
    labs = nepExplorer::adlb,
    vitals = nepExplorer::advs,
    demo = nepExplorer::adsl,
    settings = NULL,
    runNow = TRUE
) {
  
  # create default settings when settings is not defined by default
  # I kept these consistent with safetycharts metadata, incase we wanto to switch to using default
  # LAB and DM domains
  if (is.null(settings)) {
    settings <- list(
      labs = list("id_col" = "USUBJID", "measure_col" = "TEST",
                  "measure_values" = list("Creatinine" = "Creatinine",
                                          "Cystatin C" = "Cystatin C",
                                          "eGFR" = "eGFR",
                                          "eGFRcys" = "eGFRcys",
                                          "Albumin/Creatinine" = "Albumin/Creatinine",
                                          "Bicarbonate" =  "Bicarbonate",
                                          "Blood Urea Nitrogen" =  "Blood Urea Nitrogen",
                                          "Calcium" = "Calcium",
                                          "Chloride" = "Chloride",
                                          "Phosphorus" = "Phosphorus",
                                          "Potassium" = "Potassium",
                                          "Sodium" =  "Sodium",
                                          "Diastolic Blood Pressure" = "Diastolic Blood Pressure",
                                          "Systolic Blood Pressure" = "Systolic Blood Pressure"),
                  "value_col" = "STRESN", "unit_col" = "STRESU", "studyday_col" = "DY",
                  "visit_col" = "VISIT", "visit_order_col" = "VISITN",
                  "baseline_flag" = "BLFL", "normal_col_high" = "STNRHI",
                  "id_col" = "USUBJID", "age_col" = "AGE", "sex_col" = "SEX",
                  "race_col" = "RACE", "treatment_col" = "ARM")
    )

    ## Data Merge:
    lab_df <- rbind(vitals, labs) |> inner_join(demo [settings$labs[["id_col"]]], settings$labs[["id_col"]])
  }
  
  ## create object containing data and setting to pass to server
  params <- reactive({
    list(
      data = list(labs = lab_df),
      settings = settings
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
