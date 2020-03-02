fetch('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv')
    .then(resp => resp.text())
    .then(text => d3.csv.parse(text))
    .then(data => {
        const creatinine = data.filter(d => d.TEST === 'Creatinine');
        const egfr = creatinine.map(d => {
            const datum = {...d};
            //datum.TEST = 'eGFR';
            datum.unit_factor = /^.mol\/L$/.test(datum.STRESU) ? 32788 : 186;
            datum.result_factor = Math.pow(parseFloat(d.STRESN), -1.154);
            datum.age_factor = Math.pow(+d.AGE, -0.203);
            datum.race_factor = d.RACE === 'BLACK' ? 1.212 : 1;
            datum.sex_factor = d.SEX === 'F' ? 0.742 : 1;
            datum.egfr = datum.unit_factor * datum.result_factor * datum.age_factor * datum.race_factor * datum.sex_factor;
            //datum.STRESU = 'mL/min/1.73m²';

            return datum;
        });
        console.table(egfr.find(d => Math.random() < .01));
        const instance = nepExplorer('#container');
        //instance.init(data);
    });
