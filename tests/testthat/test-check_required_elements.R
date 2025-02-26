test_that("No warnings when all required elements are present", {
  actual_settings <- list(
    labs = list(
      "id_col" = "USUBJID", "measure_col" = "PARAM",
      "measure_values" = list("CREAT" = "Creatinine"),
      "value_col" = "STRESN", "unit_col" = "STRESU",
      "studyday_col" = "DY", "visit_col" = "VISIT",
      "visitn_col" = "VISITN", "baseline_flag" = "BLFL",
      "baseline_values" = "Y", "normal_col_high" = "STNRHI",
      "extra_col" = "EXTRA"
    ),
    dm = list("id_col" = "USUBJID"),
    vitals = list("id_col" = "USUBJID",  "measure_col" = "PARAM", "extra_col" = "EXTRA")
  )
  
  missing_elements <- check_required_elements(expected_settings, actual_settings)
  expect_equal(length(missing_elements), 0)
})

test_that("Missing settings are detected and warning is raised", {
  actual_settings <- list(
    labs = list(
      "id_col" = "USUBJID", "measure_col" = "PARAM",
      "measure_values" = list("CREAT" = "Creatinine"),
      "value_col" = "STRESN", "unit_col" = "STRESU",
      "studyday_col" = "DY", "visit_col" = "VISIT"
    ),
    dm = list("id_col" = "USUBJID"),
    vitals = list()
  )
  
  missing_elements <- check_required_elements(expected_settings, actual_settings)
  expect_equal(length(missing_elements), 6)
  expect_true("labs$visitn_col" %in% names(missing_elements))
  expect_true("labs$baseline_flag" %in% names(missing_elements))
  expect_true("labs$baseline_values" %in% names(missing_elements))
  expect_true("labs$normal_col_high" %in% names(missing_elements))
  expect_true("vitals$id_col" %in% names(missing_elements))
  
})

test_that("Nested missing settings are detected", {
  actual_settings <- list(
    labs = list(
      "id_col" = "USUBJID", "measure_col" = "PARAM",
      "measure_values" = list(),
      "value_col" = "STRESN", "unit_col" = "STRESU",
      "studyday_col" = "DY", "visit_col" = "VISIT",
      "visitn_col" = "VISITN", "baseline_flag" = "BLFL",
      "baseline_values" = "Y", "normal_col_high" = "STNRHI"
    ),
    dm = list("id_col" = "USUBJID"),
    vitals = list("id_col" = "USUBJID", "measure_col" = "PARAM")
  )
  
  missing_elements <- check_required_elements(expected_settings, actual_settings)
  expect_equal(length(missing_elements), 1)
  expect_true("labs$measure_values$CREAT" %in% names(missing_elements))
})
