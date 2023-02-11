#' Nep Explorer Module - UI
#'
#' @param id module id
#'
#' @return returns shiny module UI
#' 
#' @import shiny
#' 
#' @export
#' 
nepexplorer_ui <- function(id) {
  ns <- NS(id)

  #future home of settings panel
  sidebar <- sidebarPanel(selectizeInput(
    ns("measures"),
    "Select Measures",
    multiple = TRUE,
    choices = c("")
  ))
  
  
  main <- mainPanel(
     # Scatter PLot + Summary Table UI
      creatinineScatterUI(ns("scatter")),
      br(),
      br(),
      # Patient Profile (demography table + lab line charts) UI
      patientProfileUI(ns("patprofile")) 
  )

  ui <- sidebarLayout(
    sidebar,
    main,
    position = c("right"),
    fluid = TRUE
  )

  return(ui)
}


#' Nep Explorer Module - Server
#'
#' @param input module input
#' @param output module output
#' @param session module session
#' @param params parameters object with `data` and `settings` options.
#'
#' @return returns shiny module Server function
#'
#' @import shiny
#' @importFrom plotly event_data
#' @export
nepexplorer_server <- function(input, output, session, params){
      ns <- session$ns
      
      
      # Populate sidebar control with measures and select all by default
      observe({
        measure_col <- params()$settings$labs$measure_col
        measures <- unique(params()$data[[measure_col]])
        updateSelectizeInput(session,
                             "measures",
                             choices = measures,
                             selected = measures
        )
        
      })
      
      # map columns for lab dataset 
      adlb <- reactive({
        
        params()$data$labs %>% 
          rename( # I suppose this will break if the name already exists in dataframe - can fix this later, you get the idea
            USUBJID = params()$settings$labs$id_col,
            DY = params()$settings$labs$studyday_col,
            TEST = params()$settings$labs$measure_col,
            STRESN = params()$settings$labs$value_col,
            VISIT = params()$settings$labs$visit_col,
            VISITN = params()$settings$labs$visit_order_col,
            BLFL = params()$settings$labs$baseline_flag
          )
        
      
        
      })
      
      # get processed data to use for subsetting to subject on scatterplot click
      processed_creatinine_data <- reactive({
        creatinineScatterServer("scatter", df = adlb(), params= params()) 
      })
      
      # subject id return from plotly click event
      selected_subject <- reactive({
        processed_creatinine_data()[event_data("plotly_click", source = "scatter")$pointNumber,]$USUBJID
      })
      
      
      #Patient Profile (demo tables + lab line charts)
      observeEvent(selected_subject(),{
        
        if(length(selected_subject()) == 1){ # avoid triggering patient profiles if there isn't a subject
          patientProfileServer("patprofile", df = adlb(), subj_id = selected_subject())
        }
      },  ignoreInit = TRUE)
      
}

