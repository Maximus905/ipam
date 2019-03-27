import {color, darkenColor, lightenColor} from './Utils'

const hexCode = {
    blue:   '#007bff',
    indigo: '#6610f2',
    purple: '#6f42c1 ',
    pink:   '#e83e8c ',
    red:    '#dc3545',
    orange: '#fd7e14',
    yellow: '#ffc107',
    green:  '#28a745',
    teal:   '#20c997',
    cyan:   '#17a2b8',
    white:    '#fff',
    gray:   '#808080',
    black:    '#010101',
}
const index = {

    tableBgColor: color(hexCode.white), //is applied to table container
    tableTextColor: lightenColor(hexCode.black, 0.01), //is applied to table container

    headerBgColor: color(hexCode.blue),
    headerTextColor: darkenColor(hexCode.white, 0.01),

    bodyBgColor: darkenColor(hexCode.white, 0.1),
    bodyTextColor: lightenColor(hexCode.black, 0.01),

    tableFooterBgColor: lightenColor(hexCode.green, 1.3),
    tableFooterTextColor: darkenColor(hexCode.gray, 0.3),

    footerBgColor: lightenColor(hexCode.blue, 0.4),
    footerTextColor: darkenColor(hexCode.gray, 0.8),

    footerIconColor: hexCode.black,

    disabledColor: hexCode.gray,

    border: `1px solid ${lightenColor(hexCode.gray, 0.4)}`,

    stripedColorFactor: 0.08,
    hoverColorFactor: 0.2,

    paddingHeaderCell: [5, 10],
    paddingBodyCell: [5, 10],
    paddingTableFooterCell: [5, 10],

    selectedRowBgColor: lightenColor(hexCode.yellow, 0.7),
    selectedRowTextColor: darkenColor(hexCode.gray, 0.8)
}

export default index