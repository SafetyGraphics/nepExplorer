# main chart (scatter plot)
one point per participant

- x-axis: max fold serum creatinine change from baseline
- y-xais:
-- max eGFR change
-- max serum creatinine change from baseline
- canvas color-coding:
-- level 1:
--- x-axis: 1.5-<2 x baseline
--- y-axis: 25-<50 or 0.3-<0.7
-- level 2:
--- x-axis: 2.0-<3 x baseline
--- y-axis: 50-<75 or 0.7-<1.2
-- level 3:
--- x-axis: 3.0-hi x baseline
--- y-axis: 75-hi or 1.2-hi
- mark color-coding: delta serum creatinine change >= 0.3

# sub-charts (time series plots)  
one point per participant per timepoint

## serum creatinine
- x-axis: time
- y-axis: result
- measures:
-- serum creatinine
-- serum cystatin C
-- difference

## eGFR
- x-axis: time
- y-axis: result
- measures:
-- eGFR serum creatinine
-- eGFR serum cystatin C
-- difference

## related measures (that the kidney filters?)
- x-axis: time
- y-axis: result
- measures:
-- BUN
-- sodium
-- potassium
-- bicarbonate
-- chloride
-- phosphate
-- calcium

## blood pressure
- x-axis: time
- y-axis: result
- measures:
-- systolic
-- diastolic

## urine albumin / creatinine ratio
- x-axis: time
- y-axis: urine albumin / creatinine

# interactivity
- click a point in main chart, view sub-charts
- specify the length of time between measurements
- data filters
- 
