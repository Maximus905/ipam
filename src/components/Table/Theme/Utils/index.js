import Color from 'color'

const color = (color) => {
    return Color(color).rgb().toString()
}
const darkenColor = (color, ratio) => {
    return Color(color).darken(ratio).rgb().toString()
}
const lightenColor = (color, ratio) => {
    return Color(color).lighten(ratio).rgb().toString()
}

export {color, darkenColor, lightenColor}