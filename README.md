# nepExplorer
<!-- badges: start -->
[![R-CMD-check](https://github.com/SafetyGraphics/nep-explorer/actions/workflows/R-CMD-check.yaml/badge.svg)](https://github.com/SafetyGraphics/nep-explorer/actions/workflows/R-CMD-check.yaml) 
<!-- badges: end -->

## Interactive Visual Kidney Function Data Exploration in Clinical Trials


### Summary

The ASA Biopharmaceutical Working Group's [taskforce on Interactive Safety Graphics](https://safetygraphics.github.io/) has developed an open-source, interactive graphical tool to allow safety professionals to easily explore clinical trial laboratory data in order to identify instances of acute declines in renal function. "Drill down" capabilities provide a means to evaluate subject level data. The tool is accompanied by a comprehensive "clinical workflow" that guides the user through a series of evaluations each with a textual discussion regarding the goal of the evaluation step and the relevance of any findings with references to the supporting nephrology literature.

### Installation
nepExplorer is not available on CRAN yet. You can install the package from GitHub:
`devtools::install_github('safetyGraphics/nepExplorer', ref = 'main')`

### Using the App

nepExplorer was built using the safetyGraphics framework and uses a settings object to map fields from input data sets to chart aesthetics and configuration options. A demo of the app is available [here](https://sb75h1-preston0burns.shinyapps.io/nep-explorer/).

The {nepExplorer} package can be used in two ways:

-   As a standalone app using create_nepexplorer_app(). See [code example](https://github.com/SafetyGraphics/nepExplorer/blob/master/inst/examples/standalone_app.R) here.

-   As a shiny module within a [safetyGraphics](https://github.com/SafetyGraphics/safetyGraphics) application. See [code example](https://github.com/SafetyGraphics/nepExplorer/blob/master/inst/examples/safetyGraphics_demo_app.R) here.

Data domain, field, and format expectations are detailed in the [Data and Settings Guidelines Wiki](https://github.com/SafetyGraphics/nepExplorer/wiki/Data-and-Settings-Guidelines).

If it's your first time configuring and running nepExplorer, check out the Configuration vignette for a walkthrough. (Under Construction)
