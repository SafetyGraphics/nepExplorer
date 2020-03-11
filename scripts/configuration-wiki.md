The most straightforward way to customize the Nephrotoxicity Explorer is by using a configuration object whose properties describe the behavior and appearance of the chart. Since the Nephrotoxicity Explorer is a Webcharts `chart` object, many default Webcharts settings are set in the [webchartsSettings.js file](https://github.com/SafetyGraphics/nep-explorer/blob/master/src/configuration/webchartsSettings.js) as [described below](#webcharts-settings). Refer to the [Webcharts documentation](https://github.com/SafetyGraphics/Webcharts/wiki/Chart-Configuration) for more details on these settings.

In addition to the standard Webcharts settings several custom settings not available in the base Webcharts library have been added to the Nephrotoxicity Explorer to facilitate data mapping and other custom functionality. These custom settings are described in detail below. All defaults can be overwritten by users.

# Renderer-specific settings
The sections below describe each nep-explorer setting as of version 0.1.0.

## settings.id_col
`string`

a variable that contains IDs for each participant

**default:** `"USUBJID"`



## settings.visit_col
`string`

name of variable that captures visit name

**default:** `"VISIT"`



## settings.visitn_col
`string`

name of variable that captures sort order of visit

**default:** `"VISITNUM"`



## settings.studyday_col
`string`

name of variable that captures study day of visit

**default:** `"DY"`



## settings.measure_col
`string`

a variable that contains the names of each medical sign

**default:** `"TEST"`



## settings.value_col
`string`

a variable that contains the results for each medical sign; non-numeric results are removed with a notification thrown to the log

**default:** `"STRESN"`



## settings.unit_col
`string`

a variable that contains the units of each medical sign

**default:** `"STRESU"`



## settings.normal_col_low
`string`

a variable that contains the lower limit of normal of the medical sign

**default:** `"STNRLO"`



## settings.normal_col_high
`string`

a variable that contains the upper limit of normal of the medical sign

**default:** `"STNRHI"`



## settings.filters
`array`

an array of variables and metadata that will appear in the controls as data filters

**default:** none

### settings.filters[].label
`string`

a description of the variable

**default:** none

### settings.filters[].value_col
`string`

the name of the variable

**default:** none



## settings.baseline
`object`

the variable and value that identify the baseline record for a given measure

### settings.baseline.value_col
`string`

a variable that identifies a baseline record

**default:** `"ABLFL"`

### settings.baseline.values
`array`

the value or values of the baseline variable that identify a baseline record

**default:** 
```
undefined
```



## settings.measure_values
`object`

a list of key:value pairs that identify specific measures in the data

### settings.measure_values.creat
`string`

Creatinine

**default:** `"Creatinine"`

### settings.measure_values.egfr_creat
`string`

eGFR

**default:** `"eGFR"`

### settings.measure_values.cystatc
`string`

Cystatin C

**default:** `"Cystatin C"`

### settings.measure_values.egfr_cystatc
`string`

eGFRcys

**default:** `"eGFRcys"`

### settings.measure_values.bun
`string`

Blood Urea Nitrogen

**default:** `"Blood Urea Nitrogen"`

### settings.measure_values.sodium
`string`

Sodium

**default:** `"Sodium"`

### settings.measure_values.k
`string`

Potassium

**default:** `"Potassium"`

### settings.measure_values.bicarb
`string`

Bicarbonate

**default:** `"Bicarbonate"`

### settings.measure_values.cl
`string`

Chloride

**default:** `"Chloride"`

### settings.measure_values.phos
`string`

Phosphate

**default:** `"Phosphate"`

### settings.measure_values.ca
`string`

Calcium

**default:** `"Calcium"`

### settings.measure_values.diabp
`string`

Diastolic Blood Pressure

**default:** `"Diastolic Blood Pressure"`

### settings.measure_values.sysbp
`string`

Systolic Blood Pressure

**default:** `"Systolic Blood Pressure"`

### settings.measure_values.alb
`string`

Albumin

**default:** `"Albumin"`

### settings.measure_values.albcreat
`string`

Albumin/Creatinine

**default:** `"Albumin/Creatinine"`



## settings.kdigo_criteria
`object`

a list of KDIGO stages and associated attributes

### settings.kdigo_criteria.stage_1
`undefined`

undefined

**default:** none

### settings.kdigo_criteria.stage_2
`undefined`

undefined

**default:** none

### settings.kdigo_criteria.stage_3
`undefined`

undefined

**default:** none



# Webcharts settings
The object below contains Webcharts settings that define the safety-histogram chart as of version 0.1.0 of the Nep Explorer.

```
{
    "x": {
        "column": "creat_fchg",
        "type": "linear",
        "label": "Creatinine Fold Change from Baseline",
        "format": ".1f",
        "domain": [
            1,
            null
        ]
    },
    "y": {
        "column": "egfr_creat_chg",
        "type": "linear",
        "label": "eGFR Percent Change from Baseline",
        "format": ",1d",
        "domain": [
            0,
            null
        ]
    },
    "marks": [
        {
            "type": "circle",
            "per": [
                "key"
            ],
            "tooltip": "[key]: $x,$y"
        }
    ],
    "resizable": false,
    "aspect": 2
}
```