export default function detachParticipant() {
    if (
        this.nepExplorer.participant !== undefined &&
        !this.filtered_data.find(d => d.key === this.nepExplorer.participant)
    )
        // user updates filters
        delete this.nepExplorer.participant;
}
