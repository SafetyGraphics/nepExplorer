
creatinineScatterUI <-  function(id){
  ns <- NS(id)
  fluidPage(
    column(plotlyOutput(ns("scatterplot")), width=8),
    column(gt_output(ns("summary_table")), width=4),
  )
}

#library(htmlwidgets)
creatinineScatterServer <-  function(id, df) {
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
      
      #calcualte stages at event level
      processed_creatinine_data <- creatinine_data %>% 
        group_by(USUBJID) %>% 
        arrange(desc(BLFL)) %>% 
        mutate(DELTA_C = STRESN - STRESN[1L],
               KDIGO = STRESN / STRESN[1L]) %>% 
        summarize(KDIGO = max(KDIGO), DELTA_C= max(DELTA_C), STRESN = max(STRESN),  across()) %>%  # get maximum delta creatinine for each subject (same as using delta creatinine)
        mutate(
          KDIGO_STAGE =case_when(
            KDIGO > 3 | STRESN >= 4 ~ "Stage 3",
            KDIGO > 2 ~ "Stage 2",
            KDIGO > 1.5  ~ "Stage 1",
            TRUE ~ "Did not trigger KDIGO Stage"
          ),
          DELTA_STAGE =case_when(
            DELTA_C > .3  ~ "Stage 1",
            DELTA_C > 1.5 ~ "Stage 2",
            DELTA_C > 2.5  ~ "Stage 3",
            TRUE ~ "Did not trigger Delta Creatinine Stage"
          ),
        ) %>% 
        left_join(baseline_creat, by = "USUBJID") %>% 
        filter(BLFL == FALSE)
      
      
      get_highest_stage <- function(vector_of_stages) {
        if("Stage 3" %in% vector_of_stages){
          return("Stage 3")
        } else if("Stage 2" %in% vector_of_stages){
          return("Stage 2")
        } else if("Stage 1" %in% vector_of_stages){
            return("Stage 1") 
        } 
        else{
          "Stage 0"
        }
      }
        
      #get highest stage by subject
      patient_level_stages <- processed_creatinine_data %>% 
        group_by(USUBJID) %>% 
        summarize(DELTA_STAGE = get_highest_stage(DELTA_STAGE),
                  KDIGO_STAGE = get_highest_stage(KDIGO_STAGE),
          
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
      KDIGO_summary<-patient_level_stages %>% 
         group_by(KDIGO_STAGE) %>% 
        summarize(`KDIGO_N` = length(USUBJID),
                  `KDIGO_%` = length(USUBJID)/nrow(patient_level_stages))
        
    DELTA_summary<-patient_level_stages %>% 
        group_by(DELTA_STAGE) %>% 
        summarize(`DELTA_N` = length(USUBJID),
                  `DELTA_%` = length(USUBJID)/nrow(patient_level_stages))
   
    
    summary_table_data <- summary_table_template %>% 
      left_join(KDIGO_summary) %>% 
      left_join(DELTA_summary) %>% 
      replace(is.na(.), 0) %>% 
      select(-KDIGO_STAGE, Stage = DELTA_STAGE) # only need one stage column
    
   
        output$summary_table <- render_gt({
          draw_summary_table(summary_table_data)
        })
        
        javascript <- "
function(el, x){
  el.on('plotly_click', function(data) {
    var colors = [];
    // check if color is a string or array
    if(typeof data.points[0].data.marker.color == 'string'){
      for (var i = 0; i < data.points[0].data.marker.color.length; i++) {
        colors.push(data.points[0].data.marker.color);
      }
    } else {
      colors = data.points[0].data.marker.color;
    }

    // set color of selected point
    colors[data.points[0].pointNumber] = '#FFFFFF';
    Plotly.restyle(el,
      {'marker':{color: colors}},
      [data.points[0].curveNumber]
    );
  });
}
"
        
        #draw scatterplot
        output$scatterplot <- renderPlotly({
          draw_creatinine_scatter(processed_creatinine_data) %>% onRender(javascript)
        }) 
        
       
        selected_subject <- reactive(
          processed_creatinine_data[event_data("plotly_click", source = "scatter")$pointNumber,]$USUBJID)
        
        
        
        
        return(selected_subject)
      
    }
  )
}