#' Initialize Settings for nepExplorer
#'
#' @param data `list` Named list of data frames that includes participant-level subject data (`dm`)
#' labs(`labs`) and vital signs data (`vitals`).
#' @param settings `list` Named list of settings.
#'
#' @return returns list with data and settings
#'
#' @import dplyr
#'
#' @export

init_nepExplorer <- function(data, settings) {

  # check for any missing required settings and warn user
  missing_settings <- check_required_settings(expected_settings, settings)

  if (length(missing_settings) > 0) {
    warning(paste("The following required nepExplorer settings were not detected:",
                  paste(names(missing_settings), collapse = ", ")))
  }
    
  # check for any missing columns that are specified in settings
  missing_cols_results <- lapply(c("labs", "vitals", "dm"),
                                 function(domain) check_expected_cols(domain, settings, data))
  
  missing_cols_msgs <- Filter(Negate(is.null), missing_cols_results)

  if (length(missing_cols_msgs) > 0) {
    warning(paste(missing_cols_msgs, collapse = "\n"))
  }
  
  # subset vital signs dataset to blood pressure tests
  vs_sub <-
    data$vitals %>%
    filter(.data[[settings[["vitals"]]$measure_col]] %in%
             c(
               settings[["vitals"]]$measure_values$DIABP,
               settings[["vitals"]]$measure_values$SYSBP
             )) %>%
    dplyr::select(any_of(c(
      settings[["vitals"]][["id_col"]],
      settings[["vitals"]][["measure_col"]],
      settings[["vitals"]][["value_col"]],
      settings[["vitals"]][["unit_col"]],
      settings[["vitals"]][["studyday_col"]],
      settings[["vitals"]][["visit_col"]],
      settings[["vitals"]][["visitn_col"]],
      settings[["vitals"]][["baseline_flag"]]
    )))
  
  # stack labs and vitals
  vs_labs <- data$labs %>%
    dplyr::select(any_of(c(
      settings[["labs"]][["id_col"]],
      settings[["labs"]][["measure_col"]],
      settings[["labs"]][["value_col"]],
      settings[["labs"]][["unit_col"]],
      settings[["labs"]][["studyday_col"]],
      settings[["labs"]][["visit_col"]],
      settings[["labs"]][["visitn_col"]],
      settings[["labs"]][["baseline_flag"]],
      settings[["labs"]][["normal_col_high"]]
    ))) %>%
    bind_rows(vs_sub)

  
  #subset dm dataset to usable columns
  dm_sub <- data$dm %>%
    dplyr::select(any_of(c(settings[["dm"]][["id_col"]],
                           settings[["dm"]][["treatment_col"]],
                           settings[["dm"]][["race_col"]],
                           settings[["dm"]][["age_col"]])))
  
  # left join labs/vitals to keep all rows in dm
  anly <- dm_sub %>%
    dplyr::left_join(vs_labs,
                     by = setNames(settings[["dm"]][["id_col"]], settings[["labs"]][["id_col"]]))
  
  list(data = anly, settings = settings)
}
