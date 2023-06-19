#' Create Creatinine Level Data and Patient Level Stages
#'
#' @param df lab dataset in tall format with creatinine lab
#' @param settings settings object with column mappings
#'
#' @import dplyr
#' @importFrom rlang :=
#' @export
creatinine_data_fcn <- function(df, settings) {
  ## Prepare data for chart and table
  creatinine_data <- df %>%
    filter(.data[[settings$measure_col]] == settings$measure_values$Creatinine) %>%
    select(.data[[settings$id_col]], .data[[settings$studyday_col]],
           .data[[settings$visit_col]], .data[[settings$measure_col]],
           .data[[settings$value_col]], .data[[settings$baseline_flag]])
  
  #get baseline creatinine levels for each subject for hover text
  baseline_creat <- creatinine_data %>%
    filter(.data[[settings$baseline_flag]] == TRUE) %>%
    select(.data[[settings$id_col]], BASELINE = .data[[settings$value_col]])
  
  #calcualte stages at event level
  processed_creatinine_data <- creatinine_data %>%
    group_by(.data[[settings$id_col]]) %>%
    arrange(desc(.data[[settings$baseline_flag]])) %>%
    mutate(DELTA_C = .data[[settings$value_col]] - .data[[settings$value_col]][1L],
           KDIGO = .data[[settings$value_col]] / .data[[settings$value_col]][1L]) %>%
    # get maximum delta creatinine for each subject (same as using delta creatinine)
    summarize(
      KDIGO = max(.data$KDIGO),
      DELTA_C = max(.data$DELTA_C),
      !!settings$value_col := max(.data[[settings$value_col]]),
      across()
    ) %>%
    mutate(
      KDIGO_STAGE = case_when(
        .data$KDIGO > 3 | STRESN >= 4 ~ "Stage 3",
        .data$KDIGO > 2 ~ "Stage 2",
        .data$KDIGO > 1.5  ~ "Stage 1",
        TRUE ~ "Did not trigger KDIGO Stage"
      ),
      DELTA_STAGE = case_when(
        .data$DELTA_C > .3  ~ "Stage 1",
        .data$DELTA_C > 1.5 ~ "Stage 2",
        .data$DELTA_C > 2.5  ~ "Stage 3",
        TRUE ~ "Did not trigger Delta Creatinine Stage"
      ),
    ) %>%
    left_join(baseline_creat, by = settings$id_col) %>%
    filter(.data[[settings$baseline_flag]] == FALSE)
  
  
  get_highest_stage <- function(vector_of_stages) {
    if ("Stage 3" %in% vector_of_stages) {
      return("Stage 3")
    } else if ("Stage 2" %in% vector_of_stages) {
      return("Stage 2")
    } else if ("Stage 1" %in% vector_of_stages) {
      return("Stage 1")
    } else {
      "Stage 0"
    }
  }
  
  #get highest stage by subject
  patient_level_stages <- processed_creatinine_data %>%
    group_by(.data[[settings$id_col]]) %>%
    summarize(
      DELTA_STAGE = get_highest_stage(.data$DELTA_STAGE),
      KDIGO_STAGE = get_highest_stage(.data$KDIGO_STAGE),
      
    )
  
  return(
    list(
      patient_level_stages = patient_level_stages,
      creatine_level_data = processed_creatinine_data
    )
  )
  
}
