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
    p(paste0("Each point in scatterplot corresponds to a single patient and their highest creatinine value during",
    " the study. Turn on time animation to see creatinine values at particular timepoints during the study.")),
      p("Click on a point in the scatterplot to view the relevant patient's longitudinal profile."),
             p("Click and drag to zoom-in. Double-click to reset zoom."),
    column(plotlyOutput(ns("scatterplot")), width = 8),
    column(gt_output(ns("summary_table")), width = 4),
  )
}

#' Creatine Scatter Plot + Summary Table UI
#'
#' @param id module id
#' @param df lab dataset in tall format with creatinine lab
#' @param settings settings object with column mappings
#' @param animate "off" or "on", "on" displays time animation
#' @param animation_transition_time frame transition speed in seconds
#' @param animation_time_unit column for study day or visit to be used as time variable for animation
#'
#' @return returns shiny server module
#' @import shiny
#' @import dplyr
#' @importFrom gt render_gt
#' @importFrom plotly renderPlotly
#' @importFrom htmlwidgets onRender
#' @importFrom rlang :=
creatinineScatterServer <-  function(id, df, settings, animate, animation_transition_time, animation_time_unit) {
  moduleServer(
    id,
    function(input, output, session) {
      
      patient_level_stages_data <- creatinine_data_fcn(df = df, settings = settings)
      patient_level_stages <- patient_level_stages_data$patient_level_stages
      processed_creatinine_data <- patient_level_stages_data$creatine_level_data
      
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
                                  animate = animate(),
                                  animation_transition_time = animation_transition_time(),
                                  animation_time_unit = animation_time_unit()) %>% onRender(update_color_js)
          })

return(processed_creatinine_data)

    }
  )
}
