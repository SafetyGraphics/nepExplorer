## KDIGO



#test data
adlb <- read.csv('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv') %>% 
  mutate(STRESN  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", STRESN*.0113, STRESN), #Convert μmol/L to mg/dL 
         STRESU  = ifelse(TEST == "Creatinine" & STRESU == "μmol/L", "mg/dL", STRESU),
  ) %>% 
  mutate(STRESU = ifelse(TEST == "Systolic Blood Pressure", "pop", STRESU)) %>% 
  mutate(BLFL = ifelse(VISITN == 0, TRUE, FALSE)) %>% 
  filter(TEST == "Creatinine") %>% 
  select(USUBJID, TEST, STRESN, BLFL) 

delta_creat <- adlb %>% 
  group_by(USUBJID, TEST) %>% 
  arrange(desc(BLFL)) %>% 
  mutate(DELTA_C = STRESN - STRESN[1L],
         KDIGO = DELTA_C / STRESN[1L]) %>% 
  summarize(KDIGO = max(KDIGO), DELTA_C= max(DELTA_C)) # get maximum delta creatinine for each subject (same as using delta creatinine)
  
## scatterplot
  

#determine the longest axis so that we can keep plot square in ggplot axis limits
max_axis= max(max(delta_creat$KDIGO, na.rm = TRUE) * (5/6),max(delta_creat$DELTA_C, na.rm = TRUE) * 1.2, na.rm=TRUE) + .2

  ggplot(delta_creat, aes(x=KDIGO, y=DELTA_C)) +
    
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


