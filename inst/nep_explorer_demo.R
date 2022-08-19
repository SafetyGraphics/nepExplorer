library(shiny)
library(dplyr)
library(ggplot2)
library(RColorBrewer)
library(tidyverse)
library(plotly)
library(gt)

source("../R/nepexplorerMod.R")
source("../R/patient_profile_charts.R")
source("../R/patient_profile_mod.R")
source("../R/creatinine_scatter_mod.R")
source("../R/creatinine_scatter_charts.R")


test_params<- readRDS("./testdata/test_params.rds")

## TO DO: Add example shiny app of just nep explorer modiue
