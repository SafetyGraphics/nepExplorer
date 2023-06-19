# test file from
# https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv"

adlb <- read.csv("https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv",
                 encoding = "UTF-8") %>%
  mutate(STRESN  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", STRESN * .0113, STRESN), #Convert μmol/L to mg/dL
         STRESU  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", "mg/dL", STRESU),
  ) %>%
  mutate(BLFL = ifelse(VISIT == "Screening", TRUE, FALSE)) %>% # add baseline column
  ungroup() %>%
  filter(!(TEST %in% c("Diastolic Blood Pressure",
                     "Heart Rate",
                     "Respiratory Rate",
                     "Systolic Blood Pressure",
                     "Temperature", "")))

usethis::use_data(adlb, overwrite = TRUE)

