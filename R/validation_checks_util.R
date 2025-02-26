#' Expected Settings List
#'
#' This list defines the expected settings for different data domains.
#' Each domain contains specific columns and values that are required for data processing.
#'
#' @format A list with the following structure:
#' \describe{
#'   \item{labs}{A list containing the expected settings for laboratory data:
#'     \describe{
#'       \item{id_col}{Column name for the subject identifier (e.g., "USUBJID").}
#'       \item{measure_col}{Column name for the measure parameter (e.g., "PARAM").}
#'       \item{measure_values}{A list of measure values and their corresponding descriptions
#'       (e.g., list("CREAT" = "Creatinine")).}
#'       \item{value_col}{Column name for the measurement value (e.g., "STRESN").}
#'       \item{unit_col}{Column name for the measurement unit (e.g., "STRESU").}
#'       \item{studyday_col}{Column name for the study day (e.g., "DY").}
#'       \item{visit_col}{Column name for the visit description (e.g., "VISIT").}
#'       \item{visitn_col}{Column name for the visit number (e.g., "VISITN").}
#'       \item{baseline_flag}{Column name for the baseline flag (e.g., "BLFL").}
#'       \item{baseline_values}{Value indicating baseline (e.g., "Y").}
#'       \item{normal_col_high}{Column name for the upper limit of normal range
#'       (e.g., "STNRHI").}
#'     }
#'   }
#'   \item{dm}{A list containing the expected settings for demographic data:
#'     \describe{
#'       \item{id_col}{Column name for the subject identifier (e.g., "USUBJID").}
#'     }
#'   }
#'   \item{vitals}{A list containing the expected settings for vital signs data:
#'     \describe{
#'       \item{id_col}{Column name for the subject identifier (e.g., "USUBJID").}
#'       \item{measure_col}{Column name for the measure parameter (e.g., "PARAM").}
#'     }
#'   }
#' }
expected_settings <-  list(labs = list("id_col" = "USUBJID", "measure_col" = "PARAM",
                                       "measure_values" = list("CREAT" = "Creatinine"),
                                       "value_col" = "STRESN",
                                       "unit_col" = "STRESU",
                                       "studyday_col" = "DY",
                                       "visit_col" = "VISIT",
                                       "visitn_col" = "VISITN",
                                       "baseline_flag" = "BLFL",
                                       "baseline_values" = "Y",
                                       "normal_col_high" = "STNRHI"),
                           dm = list("id_col" = "USUBJID"),
                           vitals = list("id_col" = "USUBJID", "measure_col" = "PARAM"))

#' Check Required Settings in a List
#'
#' This function checks if a given list contains all the required elements specified in another list.
#' It allows for additional elements at any nesting level and prints out a message listing the missing settings, if any.
#'
#' @param required_list A list specifying the required elements.
#' @param actual_list A list to be checked against the required elements.
#' @param parent_key (Optional) A string used internally to track the full key path during recursion.
#'  Default is an empty string.
#' @return A list of missing elements, if any.
check_required_settings <- function(required_list, actual_list, parent_key = "") {
  missing_elements <- list()
  
  for (name in names(required_list)) {
    full_key <- if (parent_key == "") name else paste(parent_key, name, sep = "$")
    
    if (!name %in% names(actual_list)) {
      missing_elements[[full_key]] <- required_list[[name]]
    } else if (is.list(required_list[[name]])) {
      if (!is.list(actual_list[[name]])) {
        missing_elements[[full_key]] <- required_list[[name]]
      } else {
        nested_missing <- check_required_settings(required_list[[name]], actual_list[[name]], full_key)
        missing_elements <- c(missing_elements, nested_missing)
      }
    }
  }
  
  return(missing_elements)
}

#' Check for Missing Columns in Data
#'
#' This function checks for any columns specified in the settings object that are not present in the data.
#' It returns a message listing the missing columns, if any.
#'
#' @param data_domain A string specifying the data domain to check (e.g., "labs", "vitals", "dm").
#' @param settings_list A list containing the settings for each data domain.
#' @param data_list A list containing the data for each domain.
#' @return A string message listing the missing columns, or NULL if all expected columns are present.
check_expected_cols <- function(data_domain, settings_list, data_list) {
  
  expected_cols <- settings_list[[data_domain]][!grepl("_values$", names(settings_list[[data_domain]]))] %>%  unlist()
  
  missing_cols <- setdiff(expected_cols, colnames(data_list[[data_domain]]))
  
  if (length(missing_cols) > 0) {
    return(paste("The following columns were specified in", data_domain, "settings but not found in the",
                 data_domain, "dataset: ", paste(missing_cols, collapse = ", ")))
  } else {
    return(NULL)
  }
}
