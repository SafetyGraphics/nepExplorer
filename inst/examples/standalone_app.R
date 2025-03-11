if (!require(nepExplorer)) {devtools::install_github('safetyGraphics/nepExplorer', ref = 'master')}
if (!require(dplyr)) {install.packages("dplyr")}
library(nepExplorer)
library(dplyr)

new_mapping <- list(labs = list("id_col" = "USUBJID", "measure_col" = "TEST",
                            "measure_values" = list("CREAT" = "Creatinine", #specified measures
                                                    "CYSTC" = "Cystatin C",
                                                    "eGFR" = "eGFR",
                                                    "eGFRcys" = "eGFRcys",
                                                    "ALB/CREAT" = "Albumin/Creatinine",
                                                    "nepFC_BICARB" =  "Bicarbonate", #foldchange measures
                                                    "nepFC_BUN" =  "Blood Urea Nitrogen",
                                                    "BUN/CREAT" = "Blood Urea Nitrogen/Creatinine",
                                                    "nepFC_CA" = "Calcium",
                                                    "nepFC_CL" = "Chloride",
                                                    "nepFC_PHOS" = "Phosphorus",
                                                    "nepFC_K" = "Potassium",
                                                    "nepFC_SODIUM" =  "Sodium"
                            ),
                            "value_col" = "STRESN",
                            "unit_col" = "STRESU",
                            "studyday_col" = "DY",
                            "visit_col" = "VISIT",
                            "visitn_col" = "VISITN",
                            "baseline_flag" = "BLFL",
                            "baseline_values" = list("Y" = "TRUE"),
                            "normal_col_high" = "STNRHI"),

dm = list("id_col" = "USUBJID", "treatment_col" = "ARM"),


vitals = list("id_col" = "USUBJID", "measure_col" = "TEST",
              "baseline_values" = list("Y" = "TRUE"),
              "baseline_flag" = "BLFL",
              "visit_col" = "VISIT",
              "visitn_col" = "VISITN",
              "studyday_col" = "DY",
              "value_col" = "STRESN",
              "unit_col" = "STRESU",
              "measure_values" = list("DIABP" = "Diastolic Blood Pressure",
                                      "SYSBP" = "Systolic Blood Pressure")
)
)

create_nepexplorer_app(data = list(dm = nepExplorer::adsl, labs = nepExplorer::adlb,
                                   vitals = nepExplorer::advs), mapping = new_mapping)
