# test file from
# https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv"
# q: how to convert micro mol/L to mg/dL for creatinine?


adlb_ <- read.csv("https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv",
                 encoding = "UTF-8") %>%
  mutate(STRESN  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", STRESN / 88.4, # 1 mg/dL creatinine = 88.4 µmol/L
                          ifelse(TEST == "Blood Urea Nitrogen" & STRESU == "mmol/L", STRESN * 2.86, STRESN) # 1 mmol/L BUN = 2.8 mg/dL BUN
                          ), # Convert μmol/L to mg/dL and mmol/L to mg/dL
         STRESU  = ifelse(TEST %in% c("Creatinine", "Blood Urea Nitrogen", "Albumin"), "mg/dL", 
                          ifelse(TEST == "Albumin/Creatinine", "Ratio", STRESU))
  ) %>%
  mutate(BLFL = ifelse(VISIT == "Screening", TRUE, FALSE)) %>% # add baseline column
  ungroup() %>%
  filter(!(TEST %in% c("Diastolic Blood Pressure",
                     "Heart Rate",
                     "Respiratory Rate",
                     "Systolic Blood Pressure",
                     "Temperature", "")))

# derive BUN/serum creatinine ratio
adlb <- adlb_ %>%
  filter(TEST %in% c("Blood Urea Nitrogen", "Creatinine")) %>%
  select(-c("STNRLO", "STNRHI")) %>%
  tidyr::spread(TEST, STRESN) %>%
  mutate(STRESN = `Blood Urea Nitrogen` / Creatinine,
         TEST = "Blood Urea Nitrogen/Creatinine",
         STRESU = "Ratio") %>%
  select(-c("Blood Urea Nitrogen", "Creatinine")) %>%
  dplyr::bind_rows(adlb_) 


usethis::use_data(adlb, overwrite = TRUE)

