library(safetyGraphics)
library(yaml)
charts <- makeChartConfig()
charts$spaghetti<-prepareChart(read_yaml('scratch/spaghetti.yaml'))

safetyGraphicsApp(charts=charts)
