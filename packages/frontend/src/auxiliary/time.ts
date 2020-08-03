export const time = {
    stringify(min: number) {
        if (min < 60) {
            return `${min} min.`
        } else if (min < 60 * 24) {
            return `${Math.floor(min / 60)} h. ${min % 60 > 0 ? ` ${min % 60} min.` : ""}`
        } else {
            return `${Math.floor(min / (24 * 60))} d.`
        }
    }
}