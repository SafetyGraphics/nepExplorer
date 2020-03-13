fetch('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv')
    .then(resp => resp.text())
    .then(text => d3.csv.parse(text))
    .then(data => {
        data.forEach(d => {
            d.ABLFL = d.VISIT === 'Screening' ? 'Y' : '';
        });
        const settings = {
            groups: [
                {
                    value_col: 'SEX',
                    label: 'Sex',
                },
                {
                    value_col: 'ARM',
                    label: 'Treatment Group',
                },
                {
                    value_col: 'RACE',
                    label: 'Race',
                },
                {
                    value_col: 'SITE',
                    label: 'Site',
                },
            ],
        };
        const instance = nepExplorer('#container', settings);
        instance.init(data);
    });
