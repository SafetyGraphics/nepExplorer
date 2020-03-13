fetch('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv')
    .then(resp => resp.text())
    .then(text => d3.csv.parse(text))
    .then(data => {
        data.forEach(d => {
            d.ABLFL = d.VISIT === 'Screening' ? 'Y' : '';
        });
        const settings = {
        };
        const instance = nepExplorer('#container', settings);
        instance.init(data, '02-008');
    });
