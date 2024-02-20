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
  vs_sub <-
    data$vitals %>%
    filter(.data[[settings[["vitals"]]$measure_col]] %in%
             c(
               settings[["vitals"]]$measure_values$DIABP,
               settings[["vitals"]]$measure_values$SYSBP
             ))

  vs_labs <- data$labs %>% bind_rows(vs_sub)

  dm_sub <- data$dm %>%
    dplyr::select(settings[["dm"]][["id_col"]],
                  settings[["dm"]][["treatment_col"]])

  # left join to keep all rows in dm
  anly <- dm_sub %>%
    dplyr::left_join(vs_labs,
                     by = c(settings[["labs"]][["id_col"]],
                            settings[["labs"]][["treatment_col"]]))

  settings$labs$measure_values <-
    c(settings$labs$measure_values,
      settings$vitals$measure_values)

  labs_settings <- settings

  return(list(data = list(labs = anly), settings = labs_settings))
}
