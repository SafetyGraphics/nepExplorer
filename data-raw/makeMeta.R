# Note: expected to be run from the root package directory
library(readr)
library(usethis)

#Copy metadata to /data

#Chart-level metadata
#nepExplorer
meta_nepExplorer <- read_csv("data-raw/meta_nepExplorer.csv")[]
usethis::use_data(meta_nepExplorer, overwrite = TRUE)
