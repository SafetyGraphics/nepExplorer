if (!interactive()) {
  sink(stderr(), type = "output")
  tryCatch({
    library("nepExplorer")
  }, error = function(e) {
    devtools::load_all()
  })
} else {
  devtools::load_all()
}

#launch nepexplorer  stand-alone  app

neplab <- nepExplorer::adlb %>%
  mutate(
    PARAM = TEST,
    BLFL = ifelse(BLFL==TRUE, "Y", BLFL)
  )

nepvitals <- nepExplorer::advs %>%
  mutate(
    PARAM = ifelse(TEST=="Systolic Blood Pressure", "Systolic Blood Pressure (mmHg)", ifelse(TEST=="Diastolic Blood Pressure", "Diastolic Blood Pressure (mmHg)", TEST)),
    BLFL = ifelse(BLFL==TRUE, "Y", BLFL)
  )

unique(neplab$BLFL)

create_nepexplorer_app(data = list(dm = nepExplorer::adsl, labs = neplab, vitals = nepvitals))
# create_nepexplorer_app() # see ?create_nepexplorer_app for more info
