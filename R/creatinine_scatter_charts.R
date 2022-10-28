
draw_creatinine_scatter <- function(df){
  
  #determine the longest axis so that we can keep plot square in ggplot axis limits
  max_axis= max(max(df$KDIGO, na.rm = TRUE) * (5/6),max(df$DELTA_C, na.rm = TRUE) * 1.2, na.rm=TRUE) + .2
  
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
    
    theme(panel.border = element_blank(), panel.grid.major = element_blank(),
          panel.grid.minor = element_blank(), axis.line = element_line(colour = "black")) +
    
    scale_x_continuous(name ="KDIGO (Fold increase from baseline (or ≥ 4 mg/dL))", 
                       breaks=c(1.5,2,2.5,3), limits = c(0, max(3.5, max_axis * 1.2, na.rm=TRUE)), labels=c("1.5x","2.0x","2.5x","3.0x*")
                       , expand = c(0, 0)) +
    
    scale_y_continuous(name ="Delta Creatinine (Absolute increase from baseline)", 
                       breaks=c(.3,1.5,2.5), limits = c(0, max(3, max_axis * (5/6), na.rm=TRUE)), labels=c("0.3 mg/dL","1.5 mg/dL","2.5 mg/dL")
                       , expand = c(0, 0)) +
    
    
    # add colored stage rectangles
    annotate("rect", xmin = 0, xmax = Inf, ymin = 0, ymax = Inf, # Stage 3
             fill ="red") +
    annotate("rect", xmin = 0, xmax = 3, ymin = 0, ymax = 2.5, # Stage 2 
             fill ="orange") +
    annotate("rect", xmin = 0, xmax = 2, ymin = 0, ymax = 1.5, # Stage 1 
             alpha = .2, fill = "yellow") +
    annotate("rect", xmin = 0, xmax = 1.5, ymin = 0, ymax = .3, # No stage 
             fill ="white") +
    
    #add annotations for stage rectangles
    annotate("text", label = "Stage 3", x= (max_axis * 1.2) -.3 , y = max_axis * (5/6)-.2) + # Stage 3
    annotate("text", label = "Stage 2", x=2.6, y = 2.3) + # Stage 2
    annotate("text", label = "Stage 1", x=1.6, y = 1.3) + # Stage 1
    
    # add points last to prevent them from being covered up
    geom_point() 
  
  ggplotly(p, tooltip="text")
}

 draw_summary_table <- function (df ){
   
  
   df %>% 
     gt() %>% 
     cols_move(columns = DELTA_STAGE, after= `KDIGO_%`) %>% 
    cols_label(KDIGO_STAGE = "KDIGO",
               KDIGO_N = "#",
               `KDIGO_%` = "%",
               DELTA_STAGE = "Delta Creatinine",
               DELTA_N = "#",
               `DELTA_%` = "%") %>% 
     fmt_percent(
       columns = c("KDIGO_%","DELTA_%"),
       decimals = 1
     )
 }

