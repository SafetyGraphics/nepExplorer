# test file from
# https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv"
# The conversion factors may vary based on your specific data.
# It's recommended to use the conversion units established by your
# own sponsor lab conversions.

# Helper functions for unit conversions - shortened names
# The conversion factors may vary based on your specific data.
# It's recommended to use the conversion units established by your
# own sponsor lab conversions.

# 1 mg/dL creatinine = 88.4 µmol/L
convert_creat_to_mgdl <- function(value) {
  value / 88.4
}
# 1 mmol/L BUN = 2.8 mg/dL
convert_bun_to_mgdl <- function(value) {
  value * 2.86
}
# 1 g/L ALB = 100 mg/dL
convert_alb_to_mgdl <- function(value) {
  value * 100
}

adlb_ <- read.csv("https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv",
                 encoding = "UTF-8") %>%
  mutate(
    # Use case_when for clearer conditional logic
    STRESN = case_when(
      TEST == "Creatinine" ~ convert_creat_to_mgdl(STRESN),
      TEST == "Blood Urea Nitrogen"   ~ convert_bun_to_mgdl(STRESN),
      TEST == "Albumin"   ~ convert_alb_to_mgdl(STRESN),
      TRUE               ~ STRESN
    ),
    STNRLO = case_when(
      TEST == "Creatinine" ~ convert_creat_to_mgdl(STNRLO),
      TEST == "Blood Urea Nitrogen"   ~ convert_bun_to_mgdl(STNRLO),
      TEST == "Albumin"   ~ convert_alb_to_mgdl(STNRLO),
      TRUE               ~ STNRLO
    ),
    STNRHI = case_when(
      TEST == "Creatinine" ~ convert_creat_to_mgdl(STNRHI),
      TEST == "Blood Urea Nitrogen"   ~ convert_bun_to_mgdl(STNRHI),
      TEST == "Albumin"   ~ convert_alb_to_mgdl(STNRHI),
      TRUE               ~ STNRHI
    ),
    STRESU = ifelse(TEST %in% c("Creatinine", "Blood Urea Nitrogen", "Albumin"), "mg/dL",
                    ifelse(TEST == "Albumin/Creatinine", "Ratio", STRESU)),
    BLFL = ifelse(VISIT == "Screening", TRUE, FALSE) # add baseline column
  ) %>%
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

