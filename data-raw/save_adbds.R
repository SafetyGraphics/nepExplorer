# test file from https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv"
adbds <- read.csv("adbds.csv") 
 
usethis::use_data(adbds, overwrite = TRUE)
