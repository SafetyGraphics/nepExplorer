#' Draw Time Series Plot for Percent Change in Lab Values from Baseline
#'
#' @param adlb lab data in tall format that must contain DY for study day,
#'   VISITN for visit number, TEST for lab test, and STRESN for lab value
#' @param settings settings object with column mappings
#' @param labs character string or character vector specifying which labs from
#'   TEST to include
#' @param KDIGO_reference_ranges boolean for whether or not to include
#'   horizontal lines denoting KDIGO reference ranges
#'
#' @import ggplot2
#' @import dplyr
#' @import RColorBrewer
#' @importFrom plotly ggplotly
#' @importFrom plotly config
#' @importFrom scales percent_format
#'
#' @return ggplot object
drawPercentChange <- function(adlb, settings, labs = c("Creatinine", "Cystatin C"), KDIGO_reference_ranges = TRUE) {

  adlb_pct_chg <- adlb %>%
    filter(.data[[settings$measure_col]] %in% labs) %>%
    group_by(.data[[settings$measure_col]]) %>%
    arrange(.data[[settings$visitn_col]]) %>% #sort by visit order
    # for each visit, calculate % change from first visit -> have a baseline flag defined
    mutate(PCT_CHG = (.data[[settings$value_col]] - .data[[settings$value_col]][1L]) /
             .data[[settings$value_col]][1L]) %>%
    ungroup() #use baseline column ABLFL baseline flag "Y"

  #1) see if i can add that flag to our test data (not good ieda to derive this ourselves as its study dependent)
  #2) --- start conversation around if we don't have that
  # requirement around
  p <- ggplot(adlb_pct_chg, aes(x = .data[[settings$studyday_col]], y = .data$PCT_CHG,
                                color = .data[[settings$measure_col]],
                                group = .data[[settings$measure_col]],
                                text = paste0("Study Day: ", .data[[settings$studyday_col]], "\n",
                                              "Lab Test: ", .data[[settings$measure_col]], "\n",
                                              "Percent Change: ", sprintf("%0.1f%%", .data$PCT_CHG * 100)
                                ))) +
    geom_line() +
    geom_point() +
    theme_bw() +
    scale_y_continuous(name = "Percent Change",
                       labels = scales::percent_format(accuracy = 1)) + #format % on y axis
    xlab("Study Day") +
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6], name = "Lab Test") + #drop yellow

    ## Add Baseline Annotation
    geom_hline(yintercept = 0, linetype = "dashed", color = "gray") +
    annotate("text", x = max(adlb_pct_chg[[settings$studyday_col]]) / 10, y = -.05, label = "Baseline",
             color = "gray44", size = 3) +

    ## Add KDIGO Stage 1 Annotation
    geom_hline(yintercept = 1.5, linetype = "dashed", color = "gray") +
    # newline ensures nice placement beneath line
    annotate("text", x = max(adlb_pct_chg[[settings$studyday_col]]) / 10, y = 1.5, label = "\nKDIGO Stage 1",
             color = "gray44", size = 3) +

    ## Add KDIGO Stage 2 Annotation
    geom_hline(yintercept = 2, linetype = "dashed", color = "gray") +
    annotate("text", x = max(adlb_pct_chg[[settings$studyday_col]]) / 10, y = 2, label = "\nKDIGO Stage 2",
             color = "gray44", size = 3) +

    ## Add KDIGO Stage 3 Annotation (>x3 Baseline rule - not using >= 4 mg/dL rule)
    geom_hline(yintercept = 3, linetype = "dashed", color = "gray") +
    annotate("text", x = max(adlb_pct_chg[[settings$studyday_col]]) / 10, y = 3, label = "\nKDIGO Stage 3",
             color = "gray44", size = 3)

  ggplotly(p, tooltip = "text") %>%
    config(displayModeBar = FALSE)
}

#' Draw Time Series Plot for Raw Change in Lab Values from Baseline
#'
#' @param adlb lab data in tall format that must contain DY for study day,
#'   VISITN for visit number, TEST for lab test, and STRESN for lab value
#' @param settings settings object with column mappings
#' @param labs character string or character vector specifying which labs from
#'   TEST to include
#' @param delta_creatinine_ref_ranges boolean for whether or not to
#'   include horizontal lines denoting delta creatinine reference ranges
#'
#' @import ggplot2
#' @import dplyr
#' @import RColorBrewer
#' @importFrom plotly ggplotly
#' @importFrom plotly config
#' @importFrom rlang :=
#' @return ggplot object
drawRawChange <- function(adlb, settings, labs = c("Creatinine", "Cystatin C"), delta_creatinine_ref_ranges = TRUE) {

  adlb_raw_chg <- adlb %>%
    filter(.data[[settings$measure_col]] %in% labs) %>%
    group_by(.data[[settings$measure_col]]) %>%
    arrange(.data[[settings$visitn_col]]) %>% #sort by visit order
    mutate(CHG = .data[[settings$value_col]] - .data[[settings$value_col]][1L]) %>% # for each visit,
    ungroup()                                                                # calculate raw change from first visit

  n_orig_test <- n_distinct(adlb_raw_chg[[settings$measure_col]]) #save number of tests for warning information later

  # Add units to Test so that legend includes units for user to see, if units provided in data

  if (settings$unit_col != "") {

  adlb_raw_chg <- adlb_raw_chg %>%
    mutate(!!settings$measure_col := paste0(.data[[settings$measure_col]], " (", .data[[settings$unit_col]], ")"))

  }

  n_der_test <- n_distinct(adlb_raw_chg[[settings$measure_col]])

  if (n_orig_test != n_der_test) {
    warning(paste0("Some collected tests have multiple units.",
                   "Each unit-test combination will appear as a separate line in the visualization.",
                   "Standardization of units is required to achieve one line per test."))
  }

  p <- ggplot(adlb_raw_chg, aes(x = .data[[settings$studyday_col]], y = .data$CHG,
                                color = .data[[settings$measure_col]], group = .data[[settings$measure_col]],
                                text = paste0("Study Day: ",  .data[[settings$studyday_col]], "\n",
                                              "Lab Test: ", .data[[settings$measure_col]], "\n",
                                              "Raw Change: ", format(round(.data$CHG, 2), nsmall = 2)
                                ))) +
    geom_line() +
    geom_point() +
    theme_bw() +
    theme(legend.title = element_blank()) + #remove legend title
    ylab("Raw Change") +
    xlab("Study Day") +
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6], name = "Lab Test")  #drop yellow

  if (delta_creatinine_ref_ranges) {

    p <- p +
      ## Add Baseline Annotation
      geom_hline(yintercept = 0, linetype = "dashed", color = "gray") +
      annotate("text", x = max(adlb_raw_chg[[settings$studyday_col]]) / 10, y = 0, label = "\nBaseline",
               color = "gray44", size = 3) +

      ## Add Delta Creatinine Stage 1 Annotation
      geom_hline(yintercept = .3, linetype = "dashed", color = "gray") +
      annotate("text", x = max(adlb_raw_chg[[settings$studyday_col]]) / 10, y = .3,
               label = "\n\u0394 Creatinine Stage 1",
               color = "gray44", size = 3) +

      ## Add Delta Creatinine Stage 2 Annotation
      geom_hline(yintercept = 1.5, linetype = "dashed", color = "gray") +
      annotate("text", x = max(adlb_raw_chg[[settings$studyday_col]]) / 10, y = 1.5,
               label = "\n\u0394 Creatinine Stage 2",
               color = "gray44", size = 3) +

      ## Add Delta Creatinine Stage 3 Annotation
      geom_hline(yintercept = 2.5, linetype = "dashed", color = "gray") +
      annotate("text", x = max(adlb_raw_chg[[settings$studyday_col]]) / 10, y = 2.5,
               label = "\n\u0394 Creatinine Stage 3",
               color = "gray44", size = 3)
  }


  ggplotly(p, tooltip = "text") %>%
    config(displayModeBar = FALSE)
}

#' Draw Time Series Plot for Fold Change from ULN
#'
#' @param adlb lab data in tall format that must contain DY for study day,
#'   VISITN for visit number, TEST for lab test, and STRESN for lab value
#' @param settings settings object with column mappings
#' @param labs character string or character vector specifying which labs from
#'   TEST to include
#'
#' @import ggplot2
#' @import dplyr
#' @import RColorBrewer
#' @importFrom plotly ggplotly
#' @importFrom plotly config
#' @return ggplot object
drawULNFoldChange <- function(adlb, settings,
                              labs = c("Bicarbonate", "Blood Urea Nitrogen",
                                       "Calcium", "Chloride", "Phosphorus",
                                       "Potassium", "Sodium")) {

  adlb_FC <- adlb %>%
    filter(.data[[settings$measure_col]] %in% labs) %>%
    group_by(.data[[settings$measure_col]]) %>%
    arrange(.data[[settings$visitn_col]]) %>% #sort by visit order
    # for each visit, calculate % change from first visit -> have a baseline flag defined
    mutate(FOLD_CHG = (.data[[settings$value_col]] - .data[[settings$normal_col_high]]) /
             .data[[settings$normal_col_high]]) %>%
    ungroup()

  p <- ggplot(adlb_FC, aes(x = .data[[settings$studyday_col]], y = .data$FOLD_CHG,
                           color = .data[[settings$measure_col]], group = .data[[settings$measure_col]],
                           text = paste0("Study Day: ", .data[[settings$studyday_col]], "\n",
                                         "Lab Test: ", .data[[settings$measure_col]], "\n",
                                         "Fold Change: ", format(round(.data$FOLD_CHG, 2), nsmall = 2)
                           ))) +
    geom_line() +
    geom_point() +
    theme_bw() +
    theme(legend.title = element_blank()) + #remove legend title
    ylab("xULN (Fold Change)") +
    xlab("Study Day") +
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6], name = "Lab Test") + # drop yellow

    ## Add ULN Annotation
    geom_hline(yintercept = 1, linetype = "dashed", color = "gray") +
    annotate("text", x = max(adlb_FC[[settings$studyday_col]]) / 10, y = 1, label = "\nULN", color = "gray44",
             size = 3)

  ggplotly(p, tooltip = "text") %>%
    config(displayModeBar = FALSE)

}

#' Draw Time Series Plot for Blood Pressure
#'
#' @param adlb lab data in tall format that must contain DY for study day,
#'   VISITN for visit number, TEST for lab test, and STRESN for lab value
#' @param settings settings object with column mappings
#' @param labs character string or character vector specifying which labs from
#'   TEST to include
#'
#' @import ggplot2
#' @import dplyr
#' @import RColorBrewer
#' @importFrom plotly ggplotly
#' @importFrom plotly config
#' @return ggplot object
drawBloodPressure <- function(adlb, settings, labs = c("Diastolic Blood Pressure", "Systolic Blood Pressure")) {

  adlb_bp <- adlb %>%
    filter(.data[[settings$measure_col]] %in% labs)

  bp_unit <- unique(adlb_bp[[settings$unit_col]])

  if (length(bp_unit) > 1) {
    warning(paste0("Systolic and Diastolic Blood Pressure are not in the same units, ",
                   "therefore unit will not be displayed on the Y-axis. Standardize units",
                   " to see unit on Y-axis."))
  }

  p <- ggplot(adlb_bp, aes(x = .data[[settings$studyday_col]], y = .data[[settings$value_col]],
                           color = .data[[settings$measure_col]],
                           group = .data[[settings$measure_col]],
                           text = paste0("Study Day: ", .data[[settings$studyday_col]], "\n",
                                         "Lab Test: ", .data[[settings$measure_col]], "\n",
                                         "Raw Value: ", format(round(.data[[settings$value_col]], 2), nsmall = 2)
                           ))) +
    geom_line() +
    geom_point() +
    theme_bw() +
    theme(legend.title = element_blank()) + #remove legend title
    ylab(bp_unit) +
    xlab("Study Day") +
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6], name = "Lab Test")  + #drop yellow

    # Add ideal BP annotations
    geom_hline(yintercept = 80, linetype = "dashed", color = "gray") + #add diastolic dashed line
    annotate("text", x = max(adlb_bp[[settings$studyday_col]]) / 10, y = 80,
             label = "Ideal Diastolic \n Blood Pressure",
             color = "gray44",  size = 3) +

    geom_hline(yintercept = 120, linetype = "dashed", color = "gray") + #add systolic dashed line
    annotate("text", x =  max(adlb_bp[[settings$studyday_col]]) / 10, y = 120,
             label = "Ideal Systolic \n Blood Pressure",
             color = "gray44",  size = 3)

  ggplotly(p, tooltip = "text") %>%
    config(displayModeBar = FALSE)
}

#' Draw Time Series Plot for Normalized Albumin
#'
#' @param adlb lab data in tall format that must contain DY for study day,
#'   VISITN for visit number, TEST for lab test, and STRESN for lab value
#' @param settings settings object with column mappings
#'
#' @import ggplot2
#' @import dplyr
#' @import RColorBrewer
#' @importFrom plotly ggplotly
#' @importFrom plotly config
#' @return ggplot object
drawNormalizedAlbumin <- function(adlb, settings) {

  adlb_norm <- adlb %>%
    filter(.data[[settings$measure_col]] == settings$measure_values[["ALB/CREAT"]])

  uacr_unit <- unique(adlb_norm[[settings$unit_col]])

  if (length(uacr_unit) > 1)
    warning(paste0("Multiple units have been provided for UACR, therefore unit will",
                   " not be displayed on the Y-axis. Standardize units to see unit on Y-axis."))

  p <- ggplot(adlb_norm, aes(x = .data[[settings$studyday_col]], y = .data[[settings$value_col]],
                             color = .data[[settings$measure_col]], group = .data[[settings$measure_col]],
                             text = paste0("Study Day: ", .data[[settings$studyday_col]], "\n",
                                           "Lab Test: ", .data[[settings$measure_col]], "\n",
                                           "Raw Value: ", format(round(.data[[settings$value_col]], 2), nsmall = 2)
                             ))) +
    geom_line() +
    geom_point() +
    theme_bw() +
    theme(legend.title = element_blank()) + #remove legend title
    ylab(uacr_unit) +
    xlab("Study Day") +
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6], name = "Lab Test") #drop yellow

  if (tolower(uacr_unit) == "mg/g") {

    p <- p +
      ## Add KDIGO Albuminuria Stage 1 Annotation
      geom_hline(yintercept = 0, linetype = "dashed", color = "gray") +
      annotate("text", x = max(adlb_norm[[settings$studyday_col]]) / 10, y = 0, label = "\nA1 Albuminuria",
               color = "gray44", size = 3) +

      ## Add KDIGO Albuminuria Stage 2 Annotation
      geom_hline(yintercept = 30, linetype = "dashed", color = "gray") +
      annotate("text", x = max(adlb_norm[[settings$studyday_col]]) / 10, y = 30, label = "\nA2 Albuminuria",
               color = "gray44", size = 3) +

      ## Add KDIGO Albuminuria Stage 3 Annotation
      geom_hline(yintercept = 300, linetype = "dashed", color = "gray") +
      annotate("text", x = max(adlb_norm[[settings$studyday_col]]) / 10, y =  300, label = "\nA3 Albuminuria",
               color = "gray44", size = 3)

  }

  ggplotly(p, tooltip = "text") %>%
    config(displayModeBar = FALSE)
}

#' Draw Demography Table
#'
#' @param adlb lab data in tall format that must contain DY for study day,
#'   VISITN for visit number, TEST for lab test, and STRESN for lab value
#' @param settings settings object with column mappings
#' @param demo_vars character vector of column names to include in demography
#'   table - those not found in data will be ignored
#'
#' @import gt
#' @import dplyr
#' @return gt object
drawDemoTable <- function(adlb, settings, demo_vars = c("USUBJID", "AGE", "SEX", "RACE", "ARM")) {

  #specs mention: Subject ID, KDIGO Stage, Delta Creatinine Stage, Treatment group, Age, Age group, Sex, Race
  demo_data <- adlb %>%
    select(any_of(demo_vars)) %>%
    distinct()

  if (nrow(demo_data) > 1) {
    warning(paste0("Subject has multiple values for a demographic variable -",
                   " will display a row for each unique combination of demographic information."))
  }

  demo_data %>%
    gt()

}

#' Draw BUN/serum creatinine over time,
#'
#' @param adlb lab data in tall format that must contain DY for study day,
#'   VISITN for visit number, TEST for lab test, and STRESN for lab value
#' @param settings settings object with column mappings
#'
#' @import ggplot2
#' @import dplyr
#' @import RColorBrewer
#' @importFrom plotly ggplotly
#' @importFrom plotly config
#' @return ggplot object
drawBunCreat <- function(adlb, settings) {
  adlb_norm <- adlb %>%
    filter(.data[[settings$measure_col]] == settings$measure_values[["BUN/CREAT"]])

  if (is.null(adlb_norm[[settings$unit_col]]) | all(adlb_norm[[settings$unit_col]] == "")) {
    ubuncr_unit <- "Ratio"
  } else {
    ubuncr_unit <- unique(adlb_norm[[settings$unit_col]])
  }


  p <- ggplot(adlb_norm, aes(x = .data[[settings$studyday_col]], y = .data[[settings$value_col]],
                             color = .data[[settings$measure_col]], group = .data[[settings$measure_col]],
                             text = paste0("Study Day: ", .data[[settings$studyday_col]], "\n",
                                           "Lab Test: ", .data[[settings$measure_col]], "\n",
                                           "Raw Value: ", format(round(.data[[settings$value_col]], 2), nsmall = 2)
                             ))) +
    geom_line() +
    geom_point() +
    theme_bw() +
    theme(legend.title = element_blank()) + #remove legend title
    ylab(ubuncr_unit) +
    xlab("Study Day") +
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6], name = "Lab Test") #drop yellow

    p <- p +
      ## Add two threshold lines, one at 10 and one at 20.
      geom_hline(yintercept = 10, linetype = "dashed", color = "gray") +
      geom_hline(yintercept = 20, linetype = "dashed", color = "gray")

  ggplotly(p, tooltip = "text") %>%
    config(displayModeBar = FALSE)
}
