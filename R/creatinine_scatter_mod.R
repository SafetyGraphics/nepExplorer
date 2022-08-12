
creatinineScatterUI <-  function(id){
  ns <- NS(id)
  fluidPage(
    plotlyOutput(ns("scatterplot")),
  #  gt_output(ns("summary_table")),
  )
}

creatinineScatterServer <-  function(df, id) {
  moduleServer(
    id,
    function(input, output, session) {
      
      ## Prepare data for chart and table
      creatinine_data <- df %>% 
        filter(TEST == "Creatinine") %>% 
        select(USUBJID, DY, VISIT, TEST,  STRESN, BLFL) 
      
      #get baseline creatinine levels for each subject for hover text
      baseline_creat <- creatinine_data %>% 
        filter(BLFL ==TRUE) %>% 
        select(USUBJID, BASELINE = STRESN)
      
      processed_creatinine_data <- creatinine_data %>% 
        group_by(USUBJID, TEST) %>% 
        arrange(desc(BLFL)) %>% 
        mutate(DELTA_C = STRESN - STRESN[1L],
               KDIGO = DELTA_C / STRESN[1L]) %>% 
        summarize(KDIGO = max(KDIGO), DELTA_C= max(DELTA_C), STRESN = max(STRESN),  across()) %>%  # get maximum delta creatinine for each subject (same as using delta creatinine)
        mutate(
          KDIGO_STAGE =case_when(
            KDIGO > 3 | STRESN >= 4 ~ "Stage 3",
            KDIGO > 2 ~ "Stage 2",
            KDIGO > 1.5  ~ "Stage 1",
            TRUE ~ "Did not trigger KDIGO Stage"
          ),
          DELTA_STAGE =case_when(
            DELTA_C > .3  ~ "Stage 3",
            DELTA_C > 1.5 ~ "Stage 2",
            DELTA_C > 2.5  ~ "Stage 1",
            TRUE ~ "Did not trigger Delta Creatinine Stage"
          ),
        ) %>% 
        left_join(baseline_creat, by = "USUBJID")
      
      
      output$scatterplot <- renderPlotly({
        draw_creatinine_scatter(processed_creatinine_data)
      })
      
       # output$summary_table <- render_gt({
       #   draw_summary_table(processed_creatinine_data)
       # })
       # 
      
    }
  )
}