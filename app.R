library(shiny)
library(dplyr)
library(ggplot2)
library(RColorBrewer)
library(tidyverse)
library(plotly)
library(gt)

# Basic nep-explorer App

ui <-   fluidPage(
  nepexplorer_ui("nep")
)

server <- function(input, output, session) {
  nepexplorer_server("nep")
}

shinyApp(ui, server)


