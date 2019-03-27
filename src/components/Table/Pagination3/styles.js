const STYLE = {
    border: '1px solid darkgray',
    paginationWidth: 200,

    selectBlockWidth: 70,

    pageBlockWidth: 130,
    pageBlockInputWidth: 50,
    disabledColor: '#808080',
    footerIconColor: '#010101'
}
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: STYLE.paginationWidth,
        '& .rowsOnPage': {
            width: STYLE.selectBlockWidth
        }
    },
    containerDc: {
        padding: 5,
        fontSize: 'smaller',
        backgroundColor: 'inherit',
    },
    pageNumber: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: STYLE.pageBlockWidth,
        '& input': {
            width: STYLE.pageBlockInputWidth,
        }
    },
    pageNumberDc: {
        '& input': {
            padding: 2,
            margin: 0,
            border: STYLE.border,
            borderRadius: 3
        }
    },
    disabled: {
        color: [[STYLE.disabledColor], '!important']
    },
    navButton: {
        padding: [1, 3],
        color: STYLE.footerIconColor
    },
}

export default styles