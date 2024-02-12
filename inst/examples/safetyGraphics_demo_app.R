library(dplyr)
library(safetyGraphics)

  # Safety Graphics app with nep-explorer included
  charts <- c(
    safetyGraphics::makeChartConfig(),
    safetyGraphics::makeChartConfig(packages = "nepExplorer")
  )
  
  charts$nepexplorerMod$meta <- nepExplorer::meta_nepExplorer
  
  adam_adlbc <- safetyData::adam_adlbc |>
    mutate(STRESU = gsub("[\\(\\)]", "", regmatches(PARAM, gregexpr("\\(.*?\\)", PARAM))[[1]]))
  
  safetyGraphics::safetyGraphicsApp(domainData = list(
    labs = adam_adlbc,
    aes = safetyData::adam_adae,
    dm = safetyData::adam_adsl,
    vitals = safetyData::adam_advs
  ),
  charts = charts)
