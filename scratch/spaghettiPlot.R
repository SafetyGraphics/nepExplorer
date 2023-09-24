# Use sample clinical trial data sets from the {safetyData} package
library(safetyData)
library(ggplot2)
library(dplyr)

# Define data mapping using a format similar to a reactive safetyGraphics mapping
settings <- list(
  id_col="USUBJID",
  value_col="LBSTRESN",
  measure_col="LBTEST",
  studyday_col="LBDY"
)

# Define a plotting function that takes data and settings as inputs
spaghettiPlot <- function( data, settings ){
  # define plot aes - note use of standard evaluation!
  plot_aes <- aes(
    x=.data[[settings$studyday_col]],
    y=.data[[settings$value_col]],
    group=.data[[settings$id_col]]
  )

  #create the plot
  p<-ggplot(data = data, plot_aes) +
    geom_path(alpha=0.15) +
    facet_wrap(
      settings$measure_col,
      scales="free_y"
    )
  return(p)
}

# spaghettiPlot(
#   safetyData::sdtm_lb %>%
#     filter(LBTEST %in% c("Albumin","Bilirubin","Calcium","Chloride")),
#   settings
# )
