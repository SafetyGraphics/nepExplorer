% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/patient_profile_charts.R
\name{drawBunCreat}
\alias{drawBunCreat}
\title{Draw BUN/serum creatinine over time,}
\usage{
drawBunCreat(adlb, settings)
}
\arguments{
\item{adlb}{lab data in tall format that must contain DY for study day,
VISITN for visit number, TEST for lab test, and STRESN for lab value}

\item{settings}{settings object with column mappings}
}
\value{
ggplot object
}
\description{
Draw BUN/serum creatinine over time,
}
