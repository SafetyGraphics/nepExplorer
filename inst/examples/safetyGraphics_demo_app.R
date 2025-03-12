if (!require(nepExplorer)) {
  devtools::install_github("safetyGraphics/nepExplorer", ref = "master")
}
if (!require(safetyGraphics)) {
  install.packages("safetyGraphics")
}
if (!require(dplyr)) {
  install.packages("dplyr")
}

library(nepExplorer)
library(dplyr)
library(safetyGraphics)

# Safety Graphics app with nep-explorer included
charts <- c(
  safetyGraphics::makeChartConfig(),
  safetyGraphics::makeChartConfig(packages = "nepExplorer", packageLocation = "config", sourceFiles = TRUE)
)

charts$nepexplorerMod$meta <- nepExplorer::meta_nepExplorer

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

# Apply unit conversions and data cleaning
adam_adlbc_ <- safetyData::adam_adlbc |>
  mutate(
    STRESU = gsub("[\\(\\)]", "", regmatches(PARAM, gregexpr("\\(.*?\\)", PARAM))[[1]]),
    # Use case_when for clearer conditional logic
    AVAL = case_when(
      PARAMCD == "CREAT" ~ convert_creat_to_mgdl(AVAL),
      PARAMCD == "BUN"   ~ convert_bun_to_mgdl(AVAL),
      PARAMCD == "ALB"   ~ convert_alb_to_mgdl(AVAL),
      TRUE               ~ AVAL
    ),
    BASE = case_when(
      PARAMCD == "CREAT" ~ convert_creat_to_mgdl(BASE),
      PARAMCD == "BUN"   ~ convert_bun_to_mgdl(BASE),
      PARAMCD == "ALB"   ~ convert_alb_to_mgdl(BASE),
      TRUE               ~ BASE
    ),
    CHG = case_when(
      PARAMCD == "CREAT" ~ convert_creat_to_mgdl(CHG),
      PARAMCD == "BUN"   ~ convert_bun_to_mgdl(CHG),
      PARAMCD == "ALB"   ~ convert_alb_to_mgdl(CHG),
      TRUE               ~ CHG
    ),
    A1LO = case_when(
      PARAMCD == "CREAT" ~ convert_creat_to_mgdl(A1LO),
      PARAMCD == "BUN"   ~ convert_bun_to_mgdl(A1LO),
      PARAMCD == "ALB"   ~ convert_alb_to_mgdl(A1LO),
      TRUE               ~ A1LO
    ),
    A1HI = case_when(
      PARAMCD == "CREAT" ~ convert_creat_to_mgdl(A1HI),
      PARAMCD == "BUN"   ~ convert_bun_to_mgdl(A1HI),
      PARAMCD == "ALB"   ~ convert_alb_to_mgdl(A1HI),
      TRUE               ~ A1HI
    ),
    LBSTRESN = case_when(
      PARAMCD == "CREAT" ~ convert_creat_to_mgdl(LBSTRESN),
      PARAMCD == "BUN"   ~ convert_bun_to_mgdl(LBSTRESN),
      PARAMCD == "ALB"   ~ convert_alb_to_mgdl(LBSTRESN),
      TRUE               ~ LBSTRESN
    ),
    STRESU = ifelse(PARAMCD %in% c("BUN", "CREAT", "ALB"), "mg/dL", STRESU),
    PARAM = case_when(
      PARAM == "Creatinine (umol/L)"                ~ "Creatinine (mg/dL)",
      PARAM == "Blood Urea Nitrogen (mmol/L)"       ~ "Blood Urea Nitrogen (mg/dL)",
      PARAM == "Albumin (g/L)"                      ~ "Albumin (mg/dL)",
      TRUE                                         ~ PARAM
    ) # todo: consider removing the units from the PARAM column - if this is implemented also update meta_nepExplorer
  )
# derive BUN/serum creatinine ratio
# Filter and select relevant columns
adam_adlbc_filtered <- adam_adlbc_ %>%
  filter(PARAMCD %in% c("BUN", "CREAT", "ALB")) %>%
  select(
    -A1LO, -A1HI, -R2A1LO, -R2A1HI, -BR2A1LO, -BR2A1HI,
    -ALBTRVAL, -ANRIND, -BNRIND, -ABLFL, -AENTMTFL, -LBSEQ,
    -LBNRIND, -AVAL, -BASE, -CHG, -PARAMN, -PARAM
  )

# Reshape the data
adam_adlbc_wide <- adam_adlbc_filtered %>%
  tidyr::spread(PARAMCD, LBSTRESN)

# Calculate BUN/CREAT ratio
adam_adlbc_bc <- adam_adlbc_wide %>%
  mutate(
    LBSTRESN = BUN / CREAT,
    PARAMCD = "BUN/CREAT",
    PARAM = "Blood Urea Nitrogen/Creatinine",
    STRESU = "Ratio",
    AVAL = LBSTRESN
  )

# Calculate ALB/CREAT ratio
adam_adlbc_ac <- adam_adlbc_wide %>%
  mutate(
    LBSTRESN = ALB / CREAT,
    PARAMCD = "ALB/CREAT",
    PARAM = "Albumin/Creatinine",
    STRESU = "Ratio",
    AVAL = LBSTRESN
  )

# Combine the data
adam_adlbc_final <- adam_adlbc_ac %>%
  dplyr::bind_rows(adam_adlbc_bc, adam_adlbc_) %>%
  select(-BUN, -CREAT, -ALB)

safetyGraphics::safetyGraphicsApp(domainData = list(
  labs = adam_adlbc_final,
  aes = safetyData::adam_adae,
  dm = safetyData::adam_adsl,
  vitals = safetyData::adam_advs
),
charts = charts)
