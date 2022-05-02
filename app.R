library(shiny)
library(dplyr)
library(ggplot2)
library(RColorBrewer)
library(magrittr)
#Super basic shiny app for developing

ui <- fluidPage(
  plotOutput("percent_change"),
  plotOutput("raw_change"),
  plotOutput("standardized_values"),
  plotOutput("blood_pressure"),
  plotOutput("normalized_albumin"),
)

#move to shiny module when complete 
server <- function(input, output, session) {
  
  #test data
  df <- read.csv('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv') %>% 
    filter(USUBJID == "04-024") # choose random subject for testing 
  
  output$percent_change <- renderPlot({
    drawPercentChange(df)
  })
  
  output$raw_change <- renderPlot({
    drawRawChange(df)
  })
  
  output$standardized_values <- renderPlot({
    drawStandardizedValues(df)
  })
  
  output$blood_pressure <- renderPlot({
    drawBloodPressure(df)
  })
  
  output$normalized_albumin <- renderPlot({
    drawNormalizedAlbumin(df)
  })
  
  
}

shinyApp(ui, server)