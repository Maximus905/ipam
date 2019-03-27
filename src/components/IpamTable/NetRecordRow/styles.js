const LVL_INDENT_WIDTH = 20
const RIGHT_MARGIN_ICON = 8

const style = {
    lvlBlock: {
        display: 'inline-block',
        width: LVL_INDENT_WIDTH
    },
    icon: {
        marginRight: RIGHT_MARGIN_ICON,
        '&:hover': {
            cursor: 'pointer'
        }
    },
}
export {LVL_INDENT_WIDTH}
export default style
