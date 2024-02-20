if (!interactive()) {
  sink(stderr(), type = "output")
  tryCatch({
    library("nepExplorer")
  }, error = function(e) {
    devtools::load_all()
  })
} else {
  devtools::load_all()
}

new_mapping <- list(labs = list("id_col" = "USUBJID", "measure_col" = "TEST",
                            "measure_values" = list("CREAT" = "Creatinine",
                                                    "CYSTC" = "Cystatin C",
                                                    "eGFR" = "eGFR",
                                                    "eGFRcys" = "eGFRcys",
                                                    "Albumin/Creatinine" = "Albumin/Creatinine",
                                                    "BICARB" =  "Bicarbonate",
                                                    "BUN" =  "Blood Urea Nitrogen",
                                                    "CA" = "Calcium",
                                                    "CL" = "Chloride",
                                                    "PHOS" = "Phosphorus",
                                                    "K" = "Potassium",
                                                    "SODIUM" =  "Sodium"
                            ),
                            "value_col" = "STRESN",
                            "unit_col" = "STRESU",
                            "studyday_col" = "DY",
                            "visit_col" = "VISIT",
                            "visit_order_col" = "VISITN",
                            "baseline_flag" = "BLFL",
                            "baseline_values" = list("Y" = "TRUE"),
                            "normal_col_high" = "STNRHI",
                            "id_col" = "USUBJID",
                            "age_col" = "AGE",
                            "sex_col" = "SEX",
                            "race_col" = "RACE",
                            "treatment_col" = "ARM"
),

dm = list("id_col" = "USUBJID", "treatment_col" = "ARM"),

vitals = list("id_col" = "USUBJID", "treatment_col" = "ARM", "measure_col" = "TEST",
              "vs_baseline_values" = list("Y" = "TRUE"),
              "vs_baseline_flag" = "BLFL",
              "measure_values" = list("DIABP" = "Diastolic Blood Pressure",
                                      "SYSBP" = "Systolic Blood Pressure")
)
)

create_nepexplorer_app(data = list(dm = nepExplorer::adsl, labs = nepExplorer::adlb,
                                   vitals = nepExplorer::advs), mapping = new_mapping)
