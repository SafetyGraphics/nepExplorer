// TODO: use settings to define KDIGO dimensions
export default function metadata() {
    //console.log(this.config.kdigo_criteria);
    return [
        {
            label: 'KDIGO Stage 3',
            dimensions: [
                [1, this.x_dom[1]],
                [0, this.y_dom[1]]
            ],
            color: 'red'
        },
        {
            label: 'KDIGO Stage 2',
            dimensions: [
                [1, 3],
                [0, 75]
            ],
            color: 'orange'
        },
        {
            label: 'KDIGO Stage 1',
            dimensions: [
                [1, 2],
                [0, 50]
            ],
            color: 'yellow'
        },
        {
            label: '',
            dimensions: [
                [1, 1.5],
                [0, 25]
            ],
            color: 'white'
        }
    ];
}
