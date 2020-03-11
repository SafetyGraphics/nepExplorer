The Nephrotoxicity Explorer accepts [JSON](https://en.wikipedia.org/wiki/JSON) data of the format returned by [`d3.csv()`](https://github.com/d3/d3-3.x-api-reference/blob/master/CSV.md). The renderer visualizes clinical medical signs data with **one row per measurement** plus the required variables specified below.

## Data structure
one record per participant per timepoint per measure

## Data specification
required and optional variables:

| Setting | Default | Data Type | Description | Required? |
|:--------|:--------|:----------|:------------|:---------:|
|`id_col`|_USUBJID_|**character**|a variable that contains IDs for each participant||
|`visit_col`|_VISIT_|**string**|visit name||
|`visitn_col`|_VISITNUM_|**number**|sort order of visit||
|`studyday_col`|_DY_|**number**|study day of visit|**Yes**|
|`measure_col`|_TEST_|**character**|a variable that contains the names of each medical sign|**Yes**|
|`value_col`|_STRESN_|**numeric**|a variable that contains the results for each medical sign; non-numeric results are removed with a notification thrown to the log|**Yes**|
|`unit_col`|_STRESU_|**character**|a variable that contains the units of each medical sign||
|`normal_col_low`|_STNRLO_|**numeric**|a variable that contains the lower limit of normal of the medical sign||
|`normal_col_high`|_STNRHI_|**numeric**|a variable that contains the upper limit of normal of the medical sign||
|`filters[]`||**either**|an array of variables and metadata that will appear in the controls as data filters||