library(shiny)
library(dplyr)
library(ggplot2)
library(RColorBrewer)
library(tidyverse)
library(plotly)
library(gt)

#add renv at some point....

ui <- fluidPage(
  sidebarLayout(
    sidebarPanel( 
      
      # Filters/controls placeholder
      selectInput("Something","Something", choices = c("hi","hello there"))
    ),
    
    mainPanel(
      
      # Scatterplot placeholder
      creatinineScatterUI("scatter"),
      br(),
      br(),
      # Patient Profile (demo tables + lab line charts)
      patientProfileUI("patprofile") 
    )
    
  )
)

server <- function(input, output, session) {
  
  #test data
  adlb <- read.csv('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv') %>% 
    mutate(STRESN  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", STRESN*.0113, STRESN), #Convert μmol/L to mg/dL 
           STRESU  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", "mg/dL", STRESU),
    ) %>% 
    mutate(STRESU = ifelse(TEST == "Systolic Blood Pressure", "pop", STRESU)) %>% 
    group_by(TEST) %>% 
    arrange(VISITN) %>% #sort by visit order
    mutate(BLFL = ifelse(STRESN[1L], TRUE, FALSE)) %>% 
    ungroup()
  
  
  #Scatterplot (scatterplot + stage table)
  creatinineScatterServer("scatter", df = adlb) 
  
  #Patient Profile (demo tables + lab line charts)
  patientProfileServer("patprofile", df = adlb, subj_id = "04-024") # test subject
}




shinyApp(ui, server)