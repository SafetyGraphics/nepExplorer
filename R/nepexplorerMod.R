#' Nep Explorer Module - UI
#'
#' @param id module id
#'
#' @return returns shiny module UI
#' @import shiny
#' @importFrom shinyjs useShinyjs
#' @importFrom shinyjs hidden
#' @export
nepexplorer_ui <- function(id) {
  ns <- NS(id)

  #future home of settings panel
  sidebar <- sidebarPanel(
    selectizeInput(
      ns("measures"),
      "Select Measures",
      multiple = TRUE,
      choices = c("")
    ),
    radioButtons(
      ns("animate"),
      "Time Animation:",
      c("Off" = "off", "On" = "on"),
      inline = TRUE),
    hidden(
      radioButtons(
        ns("animation_time_unit"),
        "Animation Time Unit:",
        c("Study Day", "Visit"),
        inline = TRUE),
      sliderInput(
        ns("animation_transition_time"),
        "Animation Transition Speed (secs):",
        min = .1,
        max = 2,
        value = .5,
        ticks = FALSE)
    ),
    width = 2
  )


  main <- mainPanel(
    useShinyjs(),
    # Scatter PLot + Summary Table UI
    creatinineScatterUI(ns("scatter")),
    br(),
    br(),
    # Patient Profile (demography table + lab line charts) UI
    patientProfileUI(ns("patprofile")),
    width = 10
  )

  ui <- sidebarLayout(
    sidebar,
    main,
    position = c("right"),
    fluid = TRUE
  )

  return(ui)
}


#' Nep Explorer Module - Server
#'
#' @param input module input
#' @param output module output
#' @param session module session
#' @param params parameters object with `data` and `settings` options.
#'
#' @return returns shiny module Server function
#'
#' @import shiny
#' @importFrom shinyjs show
#' @importFrom shinyjs hide
#' @importFrom plotly event_data
#' @export
nepexplorer_server <- function(input, output, session, params) {
  ns <- session$ns

  param <- reactive({
    init_nepExplorer(data = params()$data,
                     settings = params()$settings)
  })

  observe({
    if (!is.null(input$animate)) {
      if (input$animate == "on") {
        shinyjs::show(id = "animation_time_unit")
        shinyjs::show(id = "animation_transition_time")
      } else {
        shinyjs::hide(id = "animation_time_unit")
        shinyjs::hide(id = "animation_transition_time")
      }
    }
  })

  # Populate sidebar control with measures and select all by default
  observe({
    measure_col <- param()$settings$labs$measure_col
    measures <- unique(param()$data$labs[[measure_col]])
    updateSelectizeInput(session,
                         "measures",
                         choices = measures,
                         selected = measures
    )

  })

  animate <- reactive(input$animate)

  animation_time_unit <- reactive({
    if (input$animation_time_unit == "Study Day") {
      param()$settings$labs$studyday_col
    } else {
      param()$settings$labs$visit_col
    }
  })

  # get processed data to use for subsetting to subject on scatterplot click
  processed_creatinine_data <- reactive({

    creatinineScatterServer("scatter", df = param()$data$labs, settings = param()$settings$labs,
                            animate = animate,
                            animation_transition_time = reactive(input$animation_transition_time),
                            animation_time_unit = animation_time_unit)
  })
  # subject id return from plotly click event
  selected_subject <- reactive({
    processed_creatinine_data()[event_data("plotly_click", source = "scatter")$pointNumber, ]$USUBJID
  })
  #Patient Profile (demo tables + lab line charts)
  observeEvent(selected_subject(), {

    if (length(selected_subject()) == 1) { # avoid triggering patient profiles if there isn't a subject
      patientProfileServer("patprofile", df = param()$data$labs,
                           settings = param()$settings$labs, subj_id = selected_subject())
    }
  }, ignoreInit = TRUE)

}
