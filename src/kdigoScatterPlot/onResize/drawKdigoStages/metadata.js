export default function metadata() {
    const metadata = this.config.criteria
        .slice()
        .sort((a, b) => a.x - b.x)
        .map((d, i) => {
            const next =
                i < this.config.criteria.length - 1
                    ? this.config.criteria[i + 1]
                    : {
                          x: this.x_dom[1],
                          y: this.y_dom[1]
                      };

            d.dimensions = [
                [this.x_dom[0], next.x],
                [this.y_dom[0], next.y]
            ];

            return d;
        })
        .reverse();

    return metadata;
}
