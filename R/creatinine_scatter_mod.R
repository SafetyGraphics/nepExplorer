#' Creatine Scatter Plot + Summary Table UI
#'
#' @param id module id
#'
#' @return returns shiny module UI
#' @import shiny
#' @importFrom gt gt_output
#' @importFrom plotly plotlyOutput
creatinineScatterUI <-  function(id) {
  ns <- NS(id)
  fluidPage(
    p(paste0("Click on a point in the scatterplot to view patient profile.",
             "Click and drag to zoom-in. Double-click to reset zoom.")),
    column(plotlyOutput(ns("scatterplot")), width = 8),
    column(gt_output(ns("summary_table")), width = 4),
  )
}

#' Creatine Scatter Plot + Summary Table UI
#'
#' @param id module id
#' @param df lab dataset in tall format with creatinine lab
#' @param settings settings object with column mappings
#'
#' @return returns shiny server module
#' @import shiny
#' @import dplyr
#' @importFrom gt render_gt
#' @importFrom plotly renderPlotly
#' @importFrom htmlwidgets onRender
#' @importFrom rlang :=
creatinineScatterServer <-  function(id, df, settings, animate, animation_time_unit) {
  moduleServer(
    id,
    function(input, output, session) {

      ## Prepare data for chart and table
      creatinine_data <- df %>%
        filter(.data[[settings$measure_col]] == settings$measure_values$Creatinine) %>%
        select(.data[[settings$id_col]], .data[[settings$studyday_col]],
               .data[[settings$visit_col]], .data[[settings$visit_order_col]],
               .data[[settings$measure_col]],
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
        summarize(KDIGO = max(.data$KDIGO), DELTA_C = max(.data$DELTA_C),
                  !!settings$value_col := max(.data[[settings$value_col]]),  across()) %>%
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
        summarize(DELTA_STAGE = get_highest_stage(.data$DELTA_STAGE),
                  KDIGO_STAGE = get_highest_stage(.data$KDIGO_STAGE),
          
        )
  
      # create template table with all grades incase not all grades are in data
      summary_table_template <- tribble(
        ~ KDIGO_STAGE, ~ DELTA_STAGE,
        "Stage 3", "Stage 3",
        "Stage 2", "Stage 2",
        "Stage 1", "Stage 1",
        "Stage 0", "Stage 0",
      )
      
      #calcualte summaries and generate summary tables
      KDIGO_summary <- patient_level_stages %>%
         group_by(.data$KDIGO_STAGE) %>%
        summarize(`KDIGO_N` = length(.data[[settings$id_col]]),
                  `KDIGO_%` = length(.data[[settings$id_col]]) / nrow(patient_level_stages))
        
    DELTA_summary <- patient_level_stages %>%
        group_by(.data$DELTA_STAGE) %>%
        summarize(`DELTA_N` = length(.data[[settings$id_col]]),
                  `DELTA_%` = length(.data[[settings$id_col]]) / nrow(patient_level_stages))

    summary_table_data <- summary_table_template %>%
      left_join(KDIGO_summary) %>%
      left_join(DELTA_summary) %>%
     mutate_if(is.numeric, coalesce, 0) %>%
      select(-.data$KDIGO_STAGE, Stage = .data$DELTA_STAGE) # only need one stage column
    
   
        output$summary_table <- render_gt({
          draw_summary_table(summary_table_data)
        })
        
        update_color_js <- "
function(el, x) {
  el.on('plotly_click', function(data) {
    var colors = [];
    // build color array
      for (var i = 0; i < data.points[0].data.x.length; i++) {
        colors.push('#000000');
      }
      
    // build size array
    var sizes = [];  
      for (var i = 0; i < data.points[0].data.x.length; i++) {
        sizes.push(9);
      }


    // set color of selected point
    colors[data.points[0].pointNumber] = '#FFFFFF';
    sizes[data.points[0].pointNumber] = 12;

    Plotly.restyle(el,
      {'marker':{color: colors, size: sizes}},
      [data.points[0].curveNumber]
    );
  });
}
"
    
        #draw scatterplot
        output$scatterplot <- renderPlotly({
          draw_creatinine_scatter(df = processed_creatinine_data, settings = settings,
                                  animate_study_day = animate(), 
                                  animation_time_unit = animation_time_unit()) %>% onRender(update_color_js)
          })

        return(processed_creatinine_data)
      
    }
  )
}
