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
      plotOutput("fakescatterplot"),
      
      # Patient Profile (demo tables + lab line charts)
      patientProfileUI("patprofile") 
    )
    
  )
)

server <- function(input, output, session) {
  
  #test data
  adlb <- read.csv('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv') %>% 
    filter(USUBJID == "04-024") %>%  # choose random subject for testing
    mutate(STRESN  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", STRESN*.0113, STRESN), #Convert μmol/L to mg/dL 
           STRESU  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", "mg/dL", STRESU),
    ) %>% 
    mutate(STRESU = ifelse(TEST == "Systolic Blood Pressure", "pop", STRESU))
  
  #Scatterplot placeholder
  output$fakescatterplot  <- renderPlot(ggplot(mtcars, aes(x=wt, y=mpg)) + geom_point())
  
  #Patient Profile (demo tables + lab line charts)
  patientProfileServer("patprofile", df = adlb) 
}




shinyApp(ui, server)