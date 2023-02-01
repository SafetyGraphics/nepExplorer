#' Draw Creatinine Scatter Plot
#'
#' @param df lab dataset in tall format with creatinine lab
#'
#' @import ggplot2
#' @import plotly
#' @importFrom magrittr %>%
#' 
draw_creatinine_scatter <- function(df){

  #calculate axes to ensure breaks are included
  max_delta = max(max(df$DELTA_C, na.rm = TRUE), 3)
  
  max_kdigo = max(max(df$KDIGO, na.rm = TRUE), 3.5)
  
  p <- ggplot(df, aes(x=KDIGO, y=DELTA_C, text = 
                                 paste0("Subject ID: ", USUBJID, "\n",
                                        "KDIGO Stage: ",KDIGO_STAGE, "\n",
                                        "Creatinine Fold Change: " ,format(round(KDIGO, 2), nsmall = 2), "\n",
                                        "Delta Creatinine Stage: " ,DELTA_STAGE, "\n",
                                        "Absolute Creatinine Change: " ,format(round(DELTA_C, 2), nsmall = 2), "\n",
                                        "Baseline Creatinine: " ,format(round(BASELINE, 2), nsmall = 2), "\n",
                                        "Max Creatinine: " ,format(round(STRESN, 2), nsmall = 2), "\n",
                                        "Max Creatinine Study Day: " ,DY, "\n",
                                        "Max Creatinine Visit: " ,VISIT
                                        
                                 ))) +
    
    theme_bw() +  
    
    theme(panel.border = element_blank(), panel.grid.major = element_blank(), # minimalist
          panel.grid.minor = element_blank(), axis.line = element_line(colour = "black")) +
    
    scale_x_continuous(name ="KDIGO (Fold increase from baseline (or ≥ 4 mg/dL))", 
                       breaks=c(1.5,2,2.5,3), limits = c(0, max_kdigo), labels=c("1.5x","2.0x","2.5x","3.0x*")
                       , expand = c(0, 0)) +
    
    scale_y_continuous(name ="Delta Creatinine (Absolute increase from baseline)", 
                       breaks=c(.3,1.5,2.5), limits = c(0,max_delta), labels=c("0.3 mg/dL","1.5 mg/dL","2.5 mg/dL")
                       , expand = c(0, 0)) +
    
    
    # add colored stage rectangles
    annotate("rect", xmin = 0, xmax = max_kdigo, ymin = 0, ymax = max_delta, # Stage 3
             fill ="red") +
    annotate("rect", xmin = 0, xmax = 3, ymin = 0, ymax = 2.5, # Stage 2 
             fill ="orange") +
    annotate("rect", xmin = 0, xmax = 2, ymin = 0, ymax = 1.5, # Stage 1 
             fill = "yellow") +
    annotate("rect", xmin = 0, xmax = 1.5, ymin = 0, ymax = .3, # No stage 
             fill ="white") +
    
    #add annotations for stage rectangles
    annotate("text", label = "Stage 3", x= .5 , y = max_delta - .2) + # Stage 3
    annotate("text", label = "Stage 2", x= .5, y = 2.3) + # Stage 2
    annotate("text", label = "Stage 1", x= .5, y = 1.3) + # Stage 1
    
    # add points last to prevent them from being covered up
    geom_point(color="white",  size=2.5, fill ="black", shape = 21, stroke = .2) 
  # Want a white border because I'm changing point size on click in plotly which interestingly adds white borders around points

  #convert to plotly without toolbar
  ggply <- ggplotly(p, tooltip="text", source = "scatter") %>% 
    event_register("plotly_click") %>% 
    config(displayModeBar = F) 
  
  
  
  # remove hover text from everything but the geom points
  ggply$x$data[[1]]$hoverinfo <- "none"
  
  ggply$x$data[[2]]$hoverinfo <- "none"
  
  ggply$x$data[[3]]$hoverinfo <- "none"
  
  ggply$x$data[[4]]$hoverinfo <- "none"
  
  ggply$x$data[[5]]$hoverinfo <- "none"
  
  ggply$x$data[[6]]$hoverinfo <- "none"
  
  ggply$x$data[[7]]$hoverinfo <- "none"
  
  
  # ggply$x$data[[8]]$selected <- list("marker" = ggply$x$data[[8]]$marker)
  # ggply$x$data[[8]]$selected$marker$size= 30
 
  ggply
 
}


#' Draw Creatinine Summary Table
#'
#' @param df lab dataset in tall format with creatinine lab
#'
#' @import gt
#' @importFrom magrittr %>%
#' 
 draw_summary_table <- function (df ){
  
   df %>% 
     gt(rowname_col = "Stage") %>% #move stage to rowname
     tab_spanner_delim(
       delim = "_"
     ) %>% 
     fmt_percent(ends_with("%"), decimals = 0) %>% #format percentage
     tab_style( #add red fill to stage 1 rowname
       style = list(
         cell_fill(color = "red")
       ),
       locations = cells_stub(rows=1
     )) %>% 
     tab_style(  #add orange fill to stage 1 rowname
       style = list(
         cell_fill(color = "orange")
       ),
       locations = cells_stub(rows=2
       )) %>% 
     tab_style(  #add yellow fill to stage 1 rowname
       style = list(
         cell_fill(color = "yellow")
       ),
       locations = cells_stub(rows=3
       )) %>% 
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
       everything() ~ px(70)
     ) 
       
    
 }

