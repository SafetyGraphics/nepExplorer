# library(shiny)
# library(dplyr)
# library(ggplot2)
# library(RColorBrewer) <- need to turn these into roxygen documentation e.g. # import RColorBrewer
# library(tidyverse)
# library(plotly)
# library(gt)

nepexplorer_ui <- function(id) {
  ns <- NS(id)

  sidebar <- sidebarPanel()
  
  main <- mainPanel(
     # Scatterplot placeholder
      creatinineScatterUI(ns("scatter")),
      br(),
      br(),
      # Patient Profile (demo tables + lab line charts)
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

nepexplorer_server <- function(id, params) {
  moduleServer(
  id,
  function(input, output, session){
  ns <- session$ns


  
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
  
  # subject id return from plotly click event
  selected_subject <- creatinineScatterServer("scatter", df = adlb) 
  
  #Patient Profile (demo tables + lab line charts)
  observeEvent(selected_subject(),{
    patientProfileServer("patprofile", df = adlb, subj_id = selected_subject()) # test subject
  },  ignoreInit = TRUE)
  
})
}