library(nepExplorer)

# Safety Graphics app with nep-explorer included
charts <- c(
  safetyGraphics::makeChartConfig(),
  safetyGraphics::makeChartConfig(packages = "nepExplorer")
)

safetyGraphics::safetyGraphicsApp(charts = charts)
