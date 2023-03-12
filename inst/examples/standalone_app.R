if (!interactive()) {
  sink(stderr(), type = "output")
  tryCatch({
    library(ctpatprofile)
  }, error = function(e) {
    devtools::load_all()
  })
} else {
  devtools::load_all()
}

#launch nepexplorer  stand-alone  app
create_nepexplorer_app() # see ?create_nepexplorer_app for more info
