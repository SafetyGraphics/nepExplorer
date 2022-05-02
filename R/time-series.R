library(tidyverse)

## TO DO::
#
# - Add Blood Pressure plot
# - Add Albumin/Creatine plot
# - Make sure horinztal line labels handle resizing
# - add tests
# - add some error handling? 



#' drawPercentChange
#'
#' Draw Time Series Plot for Percent Change in Lab Values from Baseline (add dependencies like pipe later)
#'
#' @param adlb lab data in long format that must contain DY for study day, VISITN for visit number, TEST for lab test, and STRESN for lab value
#' @param labs character string or character vector specifying which labs from TEST to include
#'
#' @import ggplot2
#' @import dplyr
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
    theme(legend.title = element_blank()) + #remove legend title
    theme_bw() + 
    annotate("text", x = max(adlb_pct_chg$DY)+.5, y = 0, label = "Baseline", color = "gray44")+ #add baseline label - this might not accommodate resizing...
    scale_y_continuous(name="Percent Change", labels = scales::percent_format(accuracy = 1)) + #format y axis
    xlab("Study Day") + #maybe move ticks to start at day 1 but keep increment automatic...
    geom_hline(yintercept=0, linetype="dashed", color = "gray") + #add baseline dashed line
    coord_cartesian(xlim = c(1, max(adlb_pct_chg$DY)),  clip = 'off')  # allow baseline label off plot to keep things clean
  
  return(p)
}

# Function for Raw Change from Baseline  Line Chart
drawRawChange <- function(adlb, labs = c("eGFR", "eGFRcys")){
  
  adlb_raw_chg <- adlb %>% 
    filter(TEST %in% labs) %>% 
    group_by(TEST) %>% 
    arrange(VISITN) %>% #sort by visit order
    mutate(CHG = (STRESN - STRESN[1L])) %>% # for each visit, calculate % change from first visit 
    ungroup()
  
  p <- ggplot(adlb_pct_chg, aes(x = DY, y = CHG, color = TEST)) +
    geom_line() + 
    geom_point() +
    theme(legend.title = element_blank()) + #remove legend title
    theme_bw() + 
    annotate("text", x = max(adlb_raw_chg$DY)+.5, y = 0, label = "Baseline", color = "gray44")+ #add baseline label - this might not accommodate resizing...
    ylab("Add units here") + 
    xlab("Study Day") + #maybe move ticks to start at day 1 but keep increment automatic...
    geom_hline(yintercept=0, linetype="dashed", color = "gray") + #add baseline dashed line
    coord_cartesian(xlim = c(1, max(adlb_raw_chg$DY)),  clip = 'off')  # allow baseline label off plot to keep things clean
  
  return(p)
}

# Function for Percent Change from Baseline  Line Chart
drawStandardizedValues <- function(adlb, labs = c("Bicarbonate", "Blood Urea Nitrogen", "Calcium", "Chloride", "Phosphorus","Potassium","Sodium")){
  
  adlb_standarized <- adlb %>% 
    filter(TEST %in% labs) %>% 
    group_by(TEST) %>% 
    arrange(VISITN) %>% #sort by visit order
    mutate(STRESN_STAN = STRESN/ STNRHI) %>% # for each visit, calculate % change from first visit 
    ungroup()
  
  p <- ggplot(adlb_standarized, aes(x = DY, y = STRESN_STAN, color = TEST)) +
    geom_line() + 
    geom_point() +
    theme_bw() + 
    theme(legend.title = element_blank()) + #remove legend title 
    annotate("text", x = max(adlb_standarized$DY)+.5, y = 1, label = "ULN", color = "gray44")+ #add baseline label - this might not accommodate resizing...
    ylab("ULN") + 
    xlab("Study Day") + #maybe move ticks to start at day 1 but keep increment automatic...
    geom_hline(yintercept=1, linetype="dashed", color = "gray") + #add baseline dashed line
    coord_cartesian(xlim = c(1, max(adlb_standarized$DY)),  clip = 'off')  # allow baseline label off plot to keep things clean
  
  return(p)
}



# test data
subj_data <- read.csv('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv') %>% 
  mutate(ABLFL = ifelse(VISIT == 'Screening', TRUE , FALSE)) %>% #Add flag for baseline value
  filter(USUBJID == "01-001") #choose random subject for testing

drawPercentChange(subj_data, labs="Creatinine")

drawPercentChange(subj_data)

drawRawChange(subj_data, labs="Creatinine")

drawRawChange(subj_data)

drawStandardizedValues(subj_data, labs="Creatinine")

drawStandardizedValues(subj_data)
