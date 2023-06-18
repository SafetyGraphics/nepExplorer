# test file from https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv"
adsl <- read.csv('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv') %>%
  mutate(STRESN  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", STRESN*.0113, STRESN), #Convert μmol/L to mg/dL
         STRESU  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", "mg/dL", STRESU),
  ) %>%
  mutate(BLFL = ifelse(VISIT == 'Screening', TRUE, FALSE)) %>% # add baseline column
  ungroup() %>%
  select(USUBJID:SAFFN) %>%
  distinct()

usethis::use_data(adsl, overwrite = TRUE)
