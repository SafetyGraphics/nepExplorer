# library(shiny)
# library(dplyr)
# library(ggplot2)
# library(RColorBrewer) <- need to turn these into roxygen documentation e.g. # import RColorBrewer
# library(tidyverse)
# library(plotly)
# library(gt)

nepexplorer_ui_SG <- function(id) {
  ns <- NS(id)

  sidebar<-sidebarPanel(
    selectizeInput(
      ns("measures"), 
      "Select Measures", 
      multiple=TRUE, 
      choices=c(""),
      options = list(
        plugins = list("remove_button"),
        create = TRUE,
        persist = TRUE # keep created choices in dropdown
      )
    )
  )

  main <- mainPanel(
     # Scatterplot placeholder
      creatinineScatterUI(ns("scatter")),
      br(),
      br(),
      # Patient Profile (demo tables + lab line charts)
      patientProfileUI(ns("patprofile")) 
  )

  ui <- fluidPage(sidebarLayout(
    sidebar,
    main,
    position = c("right"),
    fluid = TRUE
  ))

  return(ui)
}

nepexplorer_server_SG <- function(input, output, session, params) {
  ns <- session$ns

  # Populate control with measures and select all by default
  observe({
    measure_col <- params()$settings$measure_col
    measures <- unique(params()$data[[measure_col]])
    updateSelectizeInput(session,
      "measures",
      choices = measures,
      selected = input$measures
    )
    
  })

  # customize selected measures based on input
  settingsR <- reactive({
    settings <- params()$settings
    settings$measure_values <- input$measures

    return(settings)
  })

  #test data
  adlb <- read.csv('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv') %>% 
    mutate(STRESN  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", STRESN*.0113, STRESN), #Convert μmol/L to mg/dL 
           STRESU  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", "mg/dL", STRESU),
    ) %>% 
    mutate(STRESU = ifelse(TEST == "Systolic Blood Pressure", "pop", STRESU)) %>% 
    #group_by(TEST) %>% 
    #arrange(VISITN) %>% #sort by visit order
    mutate(BLFL = ifelse(VISIT == 'Screening', TRUE, FALSE)) %>% 
    ungroup()
  
  
  #Scatterplot (scatterplot + stage table)
  creatinineScatterServer("scatter", df = adlb) 
  
  #Patient Profile (demo tables + lab line charts)
  patientProfileServer("patprofile", df = adlb, subj_id = "04-024") # test subject
}