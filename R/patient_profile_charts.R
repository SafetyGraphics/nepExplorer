####    add documentation to all of these!!!!!!!

#' drawPercentChange
#'
#' Draw Time Series Plot for Percent Change in Lab Values from Baseline (add dependencies like pipe later)
#'
#' @param adlb lab data in long format that must contain DY for study day, VISITN for visit number, TEST for lab test, and STRESN for lab value
#' @param labs character string or character vector specifying which labs from TEST to include
#'
#' @import ggplot2
#' @import dplyr
#' @import RColorBrewer
#'
#' @return ggplot object
#' @export
drawPercentChange <- function(adlb, labs = c("Creatinine", "Cystatin C"), KDIGO_reference_ranges = TRUE){
  
  adlb_pct_chg <- adlb %>% 
    filter(TEST %in% labs) %>% 
    group_by(TEST) %>% 
    arrange(VISITN) %>% #sort by visit order
    mutate(PCT_CHG = (STRESN - STRESN[1L])/ STRESN[1L]) %>% # for each visit, calculate % change from first visit -> have a baseline flag defined
    ungroup() #use baseline column ABLFL baseline flag "Y"
  
  #1) see if i can add that flag to our test data (not good ieda to derive this ourselves as its study dependent)
  #2) --- start conversation around if we don't have that
  #reuirement around 
  
  p <- ggplot(adlb_pct_chg, aes(x = DY, y = PCT_CHG, color = TEST, group= TEST, text = 
                                  paste0("Study Day: ", DY, "\n",
                                         "Lab Test: ",TEST, "\n",
                                         "Percent Change: ", sprintf("%0.1f%%",PCT_CHG*100)
                                         ))) +
    geom_line() + 
    geom_point() +
    # geom_line(aes(group = VISITN), color = "black", linetype="dashed") + #add vertical lines between values for each visit
    theme_bw() + 
    scale_y_continuous(name="Percent Change", labels = scales::percent_format(accuracy = 1)) + #format % on y axis
    xlab("Study Day") +
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6], name = "Lab Test") + #drop yellow  
    
    ## Add Baseline Annotation
    geom_hline(yintercept=0, linetype="dashed", color = "gray") +
    annotate("text", x = max(adlb_pct_chg$DY)/10, y = -.05, label = "Baseline", color = "gray44", size = 3)+
    
    ## Add KDIGO Stage 1 Annotation
    geom_hline(yintercept=1.5, linetype="dashed", color = "gray") + 
    annotate("text", x = max(adlb_pct_chg$DY)/10, y = 1.5, label = "\nKDIGO Stage 1", color = "gray44", size = 3)+ #newline ensures nice placement beneath line
    
    ## Add KDIGO Stage 2 Annotation
    geom_hline(yintercept=2, linetype="dashed", color = "gray") + 
    annotate("text", x = max(adlb_pct_chg$DY)/10, y = 2, label = "\nKDIGO Stage 2", color = "gray44", size = 3)+ 
    
    ## Add KDIGO Stage 3 Annotation (>x3 Baseline rule - not using >= 4 mg/dL rule)
    geom_hline(yintercept=3, linetype="dashed", color = "gray") +  
    annotate("text", x = max(adlb_pct_chg$DY)/10, y = 3, label = "\nKDIGO Stage 3", color = "gray44", size = 3) 
  
  
  
  ggplotly(p, tooltip="text") %>% 
    config(displayModeBar = F)
}

# Function for Raw Change from Baseline Line Chart
drawRawChange <- function(adlb, labs = c("Creatinine", "Cystatin C"), delta_creatinine_reference_ranges = TRUE){
  
  adlb_raw_chg <- adlb %>% 
    filter(TEST %in% labs) %>% 
    group_by(TEST) %>% 
    arrange(VISITN) %>% #sort by visit order
    mutate(CHG = STRESN - STRESN[1L]) %>% # for each visit, calculate raw change from first visit 
    ungroup()
  
  n_orig_test <- n_distinct(adlb_raw_chg$TEST) #save number of tests for warning information later
  
  adlb_raw_chg <- adlb_raw_chg %>% 
    mutate(TEST = paste0(TEST, " (",STRESU,")")) # Add units to Test so that legend includes units for user to see
  
  n_der_test <- n_distinct(adlb_raw_chg$TEST) 
  
  if (n_orig_test != n_der_test) {
    warning("Some collected tests have multiple units. Each unit-test combination will appear as a separate line in the visualization. Standardization of units is required to achieve one line per test.")
  }
  
  p <- ggplot(adlb_raw_chg, aes(x = DY, y = CHG, color = TEST, group= TEST, text = 
                                  paste0("Study Day: ", DY, "\n",
                                         "Lab Test: ",TEST, "\n",
                                         "Raw Change: ", format(round(CHG, 2), nsmall = 2)
                                  ))) +
    geom_line() + 
    geom_point() +
    # geom_line(aes(group = VISITN), color = "black", linetype="dashed") + #add vertical lines between values for each visit
    theme_bw() + 
    theme(legend.title = element_blank()) + #remove legend title
    ylab("Raw Change") +
    xlab("Study Day") + 
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6], name = "Lab Test")  #drop yellow
  
  if (delta_creatinine_reference_ranges){
    
    p <- p +
      ## Add Baseline Annotation
      geom_hline(yintercept=0, linetype="dashed", color = "gray") +
      annotate("text", x = max(adlb_raw_chg$DY)/10, y = 0, label = "\nBaseline", color = "gray44", size = 3)+
      
      ## Add Delta Creatinine Stage 1 Annotation
      geom_hline(yintercept=.3, linetype="dashed", color = "gray") + 
      annotate("text", x = max(adlb_raw_chg$DY)/10, y = .3, label = "\nΔ Creatinine Stage 1", color = "gray44", size = 3)+
      
      ## Add Delta Creatinine Stage 2 Annotation
      geom_hline(yintercept=1.5, linetype="dashed", color = "gray") + 
      annotate("text", x = max(adlb_raw_chg$DY)/10, y = 1.5, label = "\nΔ Creatinine Stage 2", color = "gray44", size = 3)+ 
      
      ## Add Delta Creatinine Stage 3 Annotation
      geom_hline(yintercept=2.5, linetype="dashed", color = "gray") +  
      annotate("text", x = max(adlb_raw_chg$DY)/10, y = 2.5, label = "\nΔ Creatinine Stage 3", color = "gray44", size = 3) 
  }
  
  
  ggplotly(p, tooltip="text") %>% 
    config(displayModeBar = F)
}

# Function for Fold Change from ULN Lab Values Line Chart
drawULNFoldChange <- function(adlb, labs = c("Bicarbonate", "Blood Urea Nitrogen", "Calcium", "Chloride", "Phosphorus","Potassium","Sodium")){
  
  adlb_FC <- adlb %>% 
    filter(TEST %in% labs) %>% 
    group_by(TEST) %>% 
    arrange(VISITN) %>% #sort by visit order
    mutate(FOLD_CHG = (STRESN - STNRHI)/ STNRHI) %>% # for each visit, calculate % change from first visit -> have a baseline flag defined
    ungroup()
  
  p <- ggplot(adlb_FC, aes(x = DY, y = FOLD_CHG, color = TEST, group= TEST, text = 
                             paste0("Study Day: ", DY, "\n",
                                    "Lab Test: ",TEST, "\n",
                                    "Fold Change: ", format(round(FOLD_CHG, 2), nsmall = 2)
                             ))) +
    geom_line() + 
    geom_point() +
    theme_bw() + 
    theme(legend.title = element_blank()) + #remove legend title 
    ylab("xULN (Fold Change)") + 
    xlab("Study Day") + 
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6], name = "Lab Test") + #drop yellow
    
    ## Add ULN Annotation
    geom_hline(yintercept=1, linetype="dashed", color = "gray") +
    annotate("text", x = max(adlb_FC$DY)/10, y = 1, label = "\nULN", color = "gray44", size = 3)
  
  ggplotly(p, tooltip="text") %>% 
    config(displayModeBar = F)
  
}

drawBloodPressure <- function(adlb, labs = c("Diastolic Blood Pressure", "Systolic Blood Pressure")){
  
  adlb_bp <- adlb %>% 
    filter(TEST %in% labs)
  
  bp_unit<- unique(adlb_bp$STRESU) 
  
  if (length(bp_unit) > 1){
    warning("Systolic and Diastolic Blood Pressure are not in the same units, therefore unit will not be displayed on the Y-axis. Standardize units to see unit on Y-axis.")
  }
  
  p <- ggplot(adlb_bp, aes(x = DY, y = STRESN, color = TEST, 
                           group= TEST, text = 
                             paste0("Study Day: ", DY, "\n",
                                    "Lab Test: ",TEST, "\n",
                                    "Raw Value: " ,format(round(STRESN, 2), nsmall = 2)
                             ))) +
    geom_line() + 
    geom_point() +
    theme_bw() + 
    theme(legend.title = element_blank()) + #remove legend title 
    ylab(bp_unit) + 
    xlab("Study Day") +  
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6], name = "Lab Test")  + #drop yellow
  
  # Add ideal BP annotations
    geom_hline(yintercept=80, linetype="dashed", color = "gray") + #add diastolic dashed line
    annotate("text", x = max(adlb_bp$DY)/10, y = 80, label = "Ideal Diastolic \n Blood Pressure", color = "gray44",  size = 3)+ 
    
    geom_hline(yintercept=120, linetype="dashed", color = "gray") + #add systolic dashed line
    annotate("text", x =  max(adlb_bp$DY)/10, y = 120, label = "Ideal Systolic \n Blood Pressure", color = "gray44",  size = 3)
    
  ggplotly(p, tooltip="text") %>% 
    config(displayModeBar = F)
}

# Function for Percent Change from Baseline  Line Chart
drawNormalizedAlbumin <- function(adlb){ 
  
  
  # If wanted to increase things that can be normalized (add labs=c() param) Surprisingly Albumin/Creatinine already exits in the data
  # creatinine <- adlb %>% 
  #   filter(TEST == "Creatinine") %>% 
  #   pivot_wider(id_cols = c(VISIT,DY),names_from =TEST, values_from = STRESN  )
  # 
  # adlb_norm <- adlb %>% 
  #   filter(TEST %in% labs) %>% 
  #   left_join(creatinine, by=c("VISIT","DY")) %>% 
  #   mutate(STRESN_NORM = STRESN / Creatinine) %>% 
  #   mutate(TEST = paste0(TEST,"/Creatinine"))
  
  adlb_norm <- adlb %>% 
    filter(TEST == "Albumin/Creatinine") 
  
  uacr_unit<- unique(adlb_norm$STRESU) 
  
  if (length(uacr_unit) > 1){
    warning("Multiple units have been provided for UACR, therefore unit will not be displayed on the Y-axis. Standardize units to see unit on Y-axis.")
  }
  
  p <- ggplot(adlb_norm, aes(x = DY, y = STRESN, color = TEST, group= TEST, text = 
                               paste0("Study Day: ", DY, "\n",
                                      "Lab Test: ",TEST, "\n",
                                      "Raw Value: ", format(round(STRESN, 2), nsmall = 2)
                               ))) +
    geom_line() + 
    geom_point() +
    theme_bw() + 
    theme(legend.title = element_blank()) + #remove legend title 
    ylab(uacr_unit) + 
    xlab("Study Day") +
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6], name = "Lab Test") + #drop yellow
    
    ## Add KDIGO Albuminuria Stage 1 Annotation
    geom_hline(yintercept=0, linetype="dashed", color = "gray") + 
    annotate("text", x = max(adlb_norm$DY)/10, y = 0, label = "\nA1 Albuminuria", color = "gray44", size = 3)+
    
    ## Add KDIGO Albuminuria Stage 2 Annotation
    geom_hline(yintercept=30, linetype="dashed", color = "gray") + 
    annotate("text", x = max(adlb_norm$DY)/10, y = 30, label = "\nA2 Albuminuria", color = "gray44", size = 3)+
    
    ## Add KDIGO Albuminuria Stage 3 Annotation
    geom_hline(yintercept=300, linetype="dashed", color = "gray") + 
    annotate("text", x = max(adlb_norm$DY)/10, y =  300, label = "\nA3 Albuminuria", color = "gray44", size = 3)
  
  
  ggplotly(p, tooltip="text") %>% 
    config(displayModeBar = F)
}

drawDemoTable <- function(adlb, demo_vars = c("USUBJID", "AGE", "SEX", "RACE", "ARM")){
  
  #specs mention: Subject ID, KDIGO Stage, Delta Creatinine Stage, Treatment group, Age, Age group, Sex, Race
  demo_data <- adlb %>%
    select(any_of(demo_vars)) %>%
    distinct() 
    
    if(nrow(demo_data) > 1){
      warning("Subject has multiple values for a demographic variable - will display a row for each unique combination of demographic information.")
    }
  
  demo_data %>% 
    gt()
  
  
}