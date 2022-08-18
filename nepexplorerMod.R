library("safetyGraphics")
library(shiny)
library(dplyr)
library(ggplot2)
library(RColorBrewer)
library(tidyverse)
library(plotly)
library(gt)

source("R/patient_profile_charts.R")
source("R/patient_profile_mod.R")

nepexplorer_ui <- function(id) {
  ns <- NS(id)

  sidebar <- sidebarPanel(selectizeInput(
    ns("measures"),
    "Select Measures",
    multiple = TRUE,
    choices = c("")
  ))

  main <- mainPanel(
    plotOutput(ns("fakescatterplot")),
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

nepexplorer_server <- function(input, output, session, params) {
  ns <- session$ns

  # Populate control with measures and select all by default
  observe({
    measure_col <- params()$settings$measure_col
    measures <- unique(params()$data[[measure_col]])
    updateSelectizeInput(session,
      "measures",
      choices = measures,
      selected = measures
    )
  })

  # customize selected measures based on input
  settingsR <- reactive({
    settings <- params()$settings
    settings$measure_values <- input$measures
    return(settings)
  })

  # draw the chart
  output$fakescatterplot <-
    renderPlot({
      ggplot(mtcars, aes(x = wt, y = mpg)) +
        geom_point() +
        theme_bw()
    })

  # test data
  adlb <-
    read.csv(
      "https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv"
    ) %>%
    filter(USUBJID == "04-024") %>% # choose random subject for testing
    mutate(
      STRESN = ifelse(TEST == "Creatinine" &
        STRESU == "μmol/L", STRESN * .0113, STRESN),
      # Convert μmol/L to mg/dL
      STRESU = ifelse(TEST == "Creatinine" &
        STRESU == "μmol/L", "mg/dL", STRESU),
    ) %>%
    mutate(STRESU = ifelse(TEST == "Systolic Blood Pressure", "pop", STRESU))

  patientProfileServer("patprofile", df = adlb)
}

library(yaml)
charts <- makeChartConfig()
charts$nepexplorer <- prepareChart(read_yaml("nepexplorer.yaml"))
safetyGraphicsApp(charts = charts)
