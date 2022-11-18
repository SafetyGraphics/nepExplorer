library("safetyGraphics")
library(shiny)
library(dplyr)
library(ggplot2)
library(RColorBrewer)
library(tidyverse)
library(plotly)
library(gt)
library(yaml)

source("./R/nepexplorerModSG.R")
source("./R/patient_profile_charts.R")
source("./R/patient_profile_mod.R")
source("./R/creatinine_scatter_mod.R")
source("./R/creatinine_scatter_charts.R")

# Safety Graphics app with nep=explorer included

charts <- makeChartConfig()
charts$nepexplorer <- prepareChart(read_yaml("./inst/safetyGraphics/nepexplorer.yaml"))
safetyGraphicsApp(charts = charts)