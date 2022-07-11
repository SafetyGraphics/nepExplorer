library(shiny)
library(dplyr)
library(ggplot2)
library(RColorBrewer)
library(tidyverse)
library(plotly)
library(gt)
#Super basic shiny app for developing

ui <- fluidPage(
  gt_output("demo_table"),
  plotlyOutput("percent_change"),
  plotlyOutput("raw_change"),
  plotlyOutput("raw_change_egfr"),
  plotlyOutput("ULN_FC"),
  plotlyOutput("blood_pressure"),
  plotlyOutput("normalized_albumin"),
)

#move to shiny module when complete 
server <- function(input, output, session) {
  
  #test data
  df <- read.csv('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv') %>% 
    filter(USUBJID == "04-024") %>%  # choose random subject for testing
   mutate(STRESN  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", STRESN*.0113, STRESN), #Convert μmol/L to mg/dL 
          STRESU  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", "mg/dL", STRESU),
          ) %>% 
    mutate(STRESU = ifelse(TEST == "Systolic Blood Pressure", "pop", STRESU))
  
  output$demo_table <- render_gt({
    drawDemoTable(df)
  })
  
  output$percent_change <- renderPlotly({
    drawPercentChange(df)
  })
  
  output$raw_change <- renderPlotly({
    drawRawChange(df)
  })
  
  output$raw_change_egfr <- renderPlotly({
    drawRawChange(df, labs = c("eGFR", "eGFRcys"), delta_creatinine_reference_ranges = FALSE)
  })
  
  output$ULN_FC <- renderPlotly({
    drawULNFoldChange(df)
  })
  
  output$blood_pressure <- renderPlotly({
    drawBloodPressure(df)
  })
  
  output$normalized_albumin <- renderPlotly({
    drawNormalizedAlbumin(df)
  })
  
  
}

shinyApp(ui, server)