fetch('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv')
    .then(resp => resp.text())
    .then(text => d3.csv.parse(text))
    .then(data => {
        const creatinine = data
            .filter(d => d.TEST === 'Creatinine')
            .map(d => {
                const datum = {...d};

                datum.STRESN = parseFloat(d.STRESN)/88.42;
                datum.STRESU = 'mg/dL';
                datum.STNRLO = parseFloat(d.STNRLO)/88.42;
                datum.STNRHI = parseFloat(d.STNRHI)/88.42;

                return datum;
            });

        const cystatin_c = creatinine.map(d => {
            const datum = {...d};

            datum.TEST = 'Cystatin C';
            datum.STRESN = Math.random() < .4
                ? d.STRESN + (d.STRESN*Math.random()/10)
                : d.STRESN - (d.STRESN*Math.random()/10);
            datum.STRESU = 'mg/L';
            datum.STNRLO = .6;
            datum.STNRHI = 1;

            return datum;
        });

        const egfr = creatinine.map(d => {
            const datum = {...d};

            const unit_factor = /^.mol\/L$/.test(datum.STRESU) ? 32788 : 186;
            const result_factor = d.STRESN > 0 ? Math.pow(d.STRESN, -1.154) : null;
            const age_factor = Math.pow(+d.AGE, -0.203);
            const race_factor = d.RACE === 'BLACK' ? 1.212 : 1;
            const sex_factor = d.SEX === 'F' ? 0.742 : 1;

            datum.TEST = 'eGFR';
            datum.STRESN = unit_factor * result_factor * age_factor * race_factor * sex_factor;
            datum.STRESU = 'mL/min/1.73m²';
            datum.STNRLO = 90;
            datum.STNRHI = 120;

            return datum;
        });

        const egfr_cys = creatinine.map(d => {
            const datum = {...d};

            datum.TEST = 'eGFRcys';
            datum.STRESN = d.STRESN > 0 ? 1/d.STRESN : null;
            datum.STRESU = 'mL/min/1.73m²';
            datum.STNRLO = 90;
            datum.STNRHI = 120;

            return datum;
        });

        const all_data = data.concat(cystatin_c).concat(egfr).concat(egfr_cys);
        all_data.forEach(d => {
            d.ABLFL = d.VISIT === 'Screening' ? 'Y' : '';
        });
        const instance = nepExplorer('#container');
        instance.init(all_data);
    });
