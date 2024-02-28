devtools::load_all()
library(dplyr)
library(safetyGraphics)

  # Safety Graphics app with nep-explorer included
  charts <- c(
    safetyGraphics::makeChartConfig(),
    safetyGraphics::makeChartConfig(packages = "nepExplorer")
  )
  
  charts$nepexplorerMod$meta <- nepExplorer::meta_nepExplorer
  
  adam_adlbc <- safetyData::adam_adlbc |>
    mutate(STRESU = gsub("[\\(\\)]", "", regmatches(PARAM, gregexpr("\\(.*?\\)", PARAM))[[1]]),
           STRESU = ifelse(PARAM == "Creatinine (umol/L)", "mg/dL", STRESU), # convert creatine to mg/dL
           AVAL = ifelse(PARAM == "Creatinine (umol/L)", AVAL * .0113, AVAL),
           PARAM = ifelse(PARAM == "Creatinine (umol/L)", "Creatinine (mg/dL)", PARAM))
  
  safetyGraphics::safetyGraphicsApp(domainData = list(
    labs = adam_adlbc,
    aes = safetyData::adam_adae,
    dm = safetyData::adam_adsl,
    vitals = safetyData::adam_advs
  ),
  charts = charts)
