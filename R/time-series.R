library(tidyverse)

## TO DO::
#
# - add tests
# - add some error handling? 
# - add documentation
# - add interactivity



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
drawPercentChange <- function(adlb, labs = c("Creatinine", "Cystatin C")){
  
  adlb_pct_chg <- adlb %>% 
    filter(TEST %in% labs) %>% 
    group_by(TEST) %>% 
    arrange(VISITN) %>% #sort by visit order
    mutate(PCT_CHG = (STRESN - STRESN[1L])/ STRESN[1L]) %>% # for each visit, calculate % change from first visit 
    ungroup()
    
  p <- ggplot(adlb_pct_chg, aes(x = DY, y = PCT_CHG, color = TEST)) +
    geom_line() + 
    geom_point() +
    geom_line(aes(group = VISITN), color = "black", linetype="dashed") + #add vertical lines between values for each visit
    theme_bw() + 
    theme(legend.title = element_blank()) + #remove legend title
    annotate("text", x = max(adlb_pct_chg$DY), y = 0, label = "Baseline", color = "gray44")+ #add baseline label - this might not accommodate resizing...
    scale_y_continuous(name="Percent Change", labels = scales::percent_format(accuracy = 1)) + #format y axis
    xlab("Study Day") + #maybe move ticks to start at day 1 but keep increment automatic...
    geom_hline(yintercept=0, linetype="dashed", color = "gray") + #add baseline dashed line
    #coord_cartesian(xlim = c(1, max(adlb_pct_chg$DY)),  clip = 'off') +  # allow baseline label off plot to keep things clean+
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6]) #drop yellow
  
  return(p)
}

# Function for Raw Change from Baseline  Line Chart
drawRawChange <- function(adlb, labs = c("eGFR", "eGFRcys")){
  
  adlb_raw_chg <- adlb %>% 
    filter(TEST %in% labs) %>% 
    group_by(TEST) %>% 
    arrange(VISITN) %>% #sort by visit order
    mutate(CHG = STRESN - STRESN[1L]) %>% # for each visit, calculate % change from first visit 
    ungroup()
  
  p <- ggplot(adlb_raw_chg, aes(x = DY, y = CHG, color = TEST)) +
    geom_line() + 
    geom_point() +
    geom_line(aes(group = VISITN), color = "black", linetype="dashed") + #add vertical lines between values for each visit
    theme_bw() + 
    theme(legend.title = element_blank()) + #remove legend title
    annotate("text", x = max(adlb_raw_chg$DY), y = 0, label = "Baseline", color = "gray44")+ #add baseline label - this might not accommodate resizing...
    ylab("mL/min/1.73m²") + #idk why this is the label rather than the units...
    xlab("Study Day") + #maybe move ticks to start at day 1 but keep increment automatic...
    geom_hline(yintercept=0, linetype="dashed", color = "gray") + #add baseline dashed line
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6]) #drop yellow
  
  return(p)
}

# Function for Percent Change from Baseline  Line Chart
drawStandardizedValues <- function(adlb, labs = c("Bicarbonate", "Blood Urea Nitrogen", "Calcium", "Chloride", "Phosphorus","Potassium","Sodium")){
  
  adlb_standardized <- adlb %>% 
    filter(TEST %in% labs) %>% 
    group_by(TEST) %>% 
    arrange(VISITN) %>% #sort by visit order
    mutate(STRESN_STAN = STRESN/ STNRHI) %>% # for each visit, calculate % change from first visit 
    ungroup()
  
  p <- ggplot(adlb_standardized, aes(x = DY, y = STRESN_STAN, color = TEST)) +
    geom_line() + 
    geom_point() +
    theme_bw() + 
    theme(legend.title = element_blank()) + #remove legend title 
    annotate("text", x = max(adlb_standardized$DY), y = 1, label = "ULN", color = "gray44")+ #add baseline label - this might not accommodate resizing...
    ylab("[xULN]") + 
    xlab("Study Day") + #maybe move ticks to start at day 1 but keep increment automatic...
    geom_hline(yintercept=1, linetype="dashed", color = "gray") + #add baseline dashed line
     scale_colour_manual(values = brewer.pal(9, "Set1")[-6]) #drop yellow
  
  return(p)
}

drawBloodPressure <- function(adlb, labs = c("Diastolic Blood Pressure", "Systolic Blood Pressure")){
  
  adlb_bp <- adlb %>% 
    filter(TEST %in% labs)
  
  p <- ggplot(adlb_bp, aes(x = DY, y = STRESN, color = TEST)) +
    geom_line() + 
    geom_point() +
    theme_bw() + 
    theme(legend.title = element_blank()) + #remove legend title 
    annotate("text", x = max(adlb_bp$DY), y = 120, label = "Ideal Systolic \n Blood Pressure", color = "gray44")+ 
    annotate("text", x = max(adlb_bp$DY), y = 80, label = "Ideal Diastolic \n Blood Pressure", color = "gray44")+ 
    ylab("mmHG") + 
    xlab("Study Day") + #maybe move ticks to start at day 1 but keep increment automatic...
    geom_hline(yintercept=80, linetype="dashed", color = "gray") + #add diastolic dashed line
    geom_hline(yintercept=120, linetype="dashed", color = "gray") + #add systolic dashed line
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6]) #drop yellow
  
  return(p)
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
  
  p <- ggplot(adlb_norm, aes(x = DY, y = STRESN, color = TEST)) +
    geom_line() + 
    geom_point() +
    theme_bw() + 
    theme(legend.title = element_blank()) + #remove legend title 
    annotate("text", x = max(adlb_norm$DY), y = 300, label = "A3 Albuminuria", color = "gray44")+ 
    annotate("text", x = max(adlb_norm$DY), y = 30, label = "A2 Albuminuria", color = "gray44")+ 
    annotate("text", x = max(adlb_norm$DY), y = 0, label = "A1 Albuminuria", color = "gray44")+ 
    ylab("mg/g") + 
    xlab("Study Day") + #maybe move ticks to start at day 1 but keep increment automatic...
    geom_hline(yintercept=30, linetype="dashed", color = "gray") + #add A2 Albuminuria dashed line
    geom_hline(yintercept=0, linetype="dashed", color = "gray") + #add A1 Albuminuria dashed line
    geom_hline(yintercept=300, linetype="dashed", color = "gray") + #add A3 Albuminuria dashed line
    scale_colour_manual(values = brewer.pal(9, "Set1")[-6]) #drop yellow
  
  return(p)
}

