#' Draw Creatinine Scatter Plot
#'
#' @param df lab dataset in tall format with creatinine lab
#' @param settings settings object with column mappings
#' @param animate "off" or "on", "on" displays time animation
#' @param animation_transition_time frame transition speed in seconds
#' @param animation_time_unit column for study day or visit to be used as time variable for animation
#'
#' @import ggplot2
#' @importFrom plotly ggplotly
#' @importFrom plotly event_register
#' @importFrom plotly config
#' @importFrom plotly animation_opts
#' @importFrom magrittr %>%
#' @importFrom rlang .data
draw_creatinine_scatter <- function(df, settings, animate = "off",
                                    animation_transition_time = .5, animation_time_unit) {
  
  #calculate axes to ensure breaks are included
  max_delta <- max(max(df$DELTA_C, na.rm = TRUE), 3)
  max_kdigo <- max(max(df$KDIGO, na.rm = TRUE), 3.5)
  
  # place visit number in front of visit column so that it is proper sorted in plotly animation
  df <- df %>%  mutate(original_visit = .data[[settings$visit_col]],
                       !!settings$visit_col := paste(.data[[settings$visit_order_col]], .data[[settings$visit_col]])
  )

  p <- ggplot(
    df,
    aes(
      x = .data$KDIGO,
      y = .data$DELTA_C,
      text = paste0(
        "Subject ID: ", .data[[settings$id_col]], "\n",
        "KDIGO Stage: ", .data$KDIGO_STAGE, "\n",
        "Creatinine Fold Change: ", format(round(.data$KDIGO, 2), nsmall = 2), "\n",
        "Delta Creatinine Stage: ", .data$DELTA_STAGE, "\n",
        "Absolute Creatinine Change: ", format(round(.data$DELTA_C, 2), nsmall = 2), "\n",
        "Baseline Creatinine: ", format(round(.data$BASELINE, 2), nsmall = 2), "\n",
        "Max Creatinine: ", format(round(.data[[settings$value_col]], 2), nsmall = 2), "\n",
        "Max Creatinine Study Day: ", .data[[settings$studyday_col]], "\n",
        "Max Creatinine Visit: ", .data$original_visit
        
      )
    )
  ) +
    
    theme_bw() +
    
    theme(panel.border = element_blank(),
          panel.grid.major = element_blank(), # minimalist
          panel.grid.minor = element_blank(),
          axis.line = element_line(colour = "black")) +
    
    scale_x_continuous(name = "Fold Change in Serum Creatinine (*or \u2265 4 mg/dL))",
                       breaks = c(1.5, 2, 2.5, 3),
                       limits = c(0, max_kdigo),
                       labels = c("1.5x", "2.0x", "2.5x", "3.0x*"),
                       expand = c(0, 0)) +
    
    scale_y_continuous(name = "Absolue Change in Serum Creatinine",
                       breaks = c(.3, 1.5, 2.5),
                       limits = c(0, max_delta),
                       labels = c("0.3 mg/dL", "1.5 mg/dL", "2.5 mg/dL"),
                       expand = c(0, 0)) +
    
    
    # add colored stage rectangles
    annotate("rect", xmin = 0, xmax = max_kdigo, ymin = 0,
             ymax = max_delta, fill = "#f03b20") + # Stage 3
    annotate("rect", xmin = 0, xmax = 3, ymin = 0, ymax = 2.5, # Stage 2
             fill = "#feb24c") +
    annotate("rect", xmin = 0, xmax = 2, ymin = 0, ymax = 1.5, # Stage 1
             fill = "#ffeda0") +
    annotate("rect", xmin = 0, xmax = 1.5, ymin = 0, ymax = .3, # No stage
             fill = "white") +
    
    #add annotations for stage rectangles
    annotate("text", label = "Stage 3", x = .5, y = max_delta - .2) + # Stage 3
    annotate("text", label = "Stage 2", x = .5, y = 2.3) + # Stage 2
    annotate("text", label = "Stage 1", x = .5, y = 1.3) + # Stage 1
    
    # add points last to prevent them from being covered up
    
    if (animate == "on") { #frame needed for animation
      geom_point(aes_string(frame = animation_time_unit), color = "white",  size = 2.5,
                 fill = "black", shape = 21, stroke = .2)
    } else {
      geom_point(color = "white",  size = 2.5, fill = "black", shape = 21, stroke = .2)
    }
  # Want a white border because I'm changing point size on click in plotly which
  # interestingly adds white borders around points
  
  #convert to plotly without toolbar
  ggply <- ggplotly(p, tooltip = "text", source = "scatter") %>%
    event_register("plotly_click") %>%
    config(displayModeBar = FALSE)
  
  # remove hover text from everything but the geom points
  ggply$x$data[[1]]$hoverinfo <- "none"
  
  ggply$x$data[[2]]$hoverinfo <- "none"
  
  ggply$x$data[[3]]$hoverinfo <- "none"
  
  ggply$x$data[[4]]$hoverinfo <- "none"
  
  ggply$x$data[[5]]$hoverinfo <- "none"
  
  ggply$x$data[[6]]$hoverinfo <- "none"
  
  ggply$x$data[[7]]$hoverinfo <- "none"

  if (animate == "on") {
    ggply %>%  animation_opts(frame = animation_transition_time * 1000 + 500,
                              transition = animation_transition_time * 1000, redraw = FALSE)
  } else {
    ggply
  }
  
}


#' Draw Creatinine Summary Table
#'
#' @param df lab dataset in tall format with creatinine lab
#'
#' @import gt
#' @importFrom magrittr %>%
draw_summary_table <- function(df) {

  df %>%
    gt(rowname_col = "Stage") %>% #move stage to rowname
    tab_spanner_delim(
      delim = "_"
    ) %>%
    fmt_percent(ends_with("%"), decimals = 0) %>% #format percentage
    tab_style( #add red fill to stage 1 rowname
      style = list(
        cell_fill(color = "#f03b20")
      ),
      locations = cells_stub(rows = 1
      )) %>%
    tab_style(  #add orange fill to stage 1 rowname
      style = list(
        cell_fill(color = "#feb24c")
      ),
      locations = cells_stub(rows = 2
      )) %>%
    tab_style(  #add yellow fill to stage 1 rowname
      style = list(
        cell_fill(color = "#ffeda0")
      ),
      locations = cells_stub(rows = 3
      )) %>%
    tab_spanner(
      label = "Fold Change in Serum Creatinine",
      level = 1,
      columns  = starts_with("KDIGO"),
      replace = TRUE
    ) %>%
    tab_spanner(
      label = "Absolute Change in Serum Creatinine",
      level = 1,
      columns  = starts_with("DELTA"),
      replace = TRUE
    ) %>%
    tab_stubhead("KDIGO") %>%
    tab_style(
      style = cell_text(weight = "bold", v_align = "middle"),
      locations = cells_stubhead()
    ) %>%
    tab_style(
      locations = cells_column_labels(columns = everything()),
      style     = list(
        #Make text bold
        cell_text(weight = "bold")
      )
    ) %>%
    tab_style(
      locations = cells_column_spanners(),
      style     = list(
        #Make text bold
        cell_text(weight = "bold")
      )
    ) %>%
    cols_width(
      everything() ~ px(80)
    )
  
  
}
