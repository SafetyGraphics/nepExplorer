#' Run the core NepExplorer App
#'
#' @param lab_df la dataset to be loaded in to the app. Sample adbds data used by default
#' @param settings list specifying the initial mapping values for each data mapping for each domain (e.g. list(aes= list(id_col='USUBJID', seq_col='AESEQ')). 
#' @param runNow Should the shiny app object created be run directly? Helpful when writing  functions to dispatch to shinyapps, rsconnect, or shinyproxy.
#'
#' @import shiny
#' @import dplyr
#' @import ggplot2
#' @import RColorBrewer
#' @import tidyverse
#' @import plotly
#' @import gt
#' @import htmlwidgets
#' 
#' @export

create_nepexplorer_app <- function(
  lab_df=nepExplorer::adbds,
  settings=NULL,
  runNow = TRUE
  ){
  
  
  # create default settings when settings is not defined by default
  if(is.null(settings)){      
    settings<-list(
      labs=list("id_col"="USUBJID", "measure_col"="TEST", "measure_values" = list("Creatinine" =  "Creatinine"),
        "value_col" = "STRESN", "studyday_col" = "DY", "visit_col" = "VISIT", "visit_order_col" = "VISITN", "baseline_flag" = "BLFL")
    )
  }
  
  ## create object containing data and setting to pass to server
  params <- reactive({
    list(
      data=list(labs=lab_df),
      settings=settings
    )
  })
  

app <- shinyApp(
    ui =  fluidPage(nepexplorer_ui("nep")),
    server = function(input,output,session){
      callModule(nepexplorer_server, "nep", params)
  }
)
  
if(runNow)
  runApp(app)
else
  app

}



