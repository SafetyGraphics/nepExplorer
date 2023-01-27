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

#launch the app
create_nepexplorer_app() # add additional parameters here