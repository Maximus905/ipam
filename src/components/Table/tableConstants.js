export const DEFAULT_TABLE_STYLE = {
    columnPadding: '5px',

    tableWidth: '100%',
    tableMinWidth: '400px',
    tableHeight: '100%',
    tableMinHeight: '300px',

    bordered: true,
    border: '1px solid darkgray',

    padding: '5px 10px',

    columnMinWidth: '100px',
    columnMaxWidth: 300,
    scrollWidthPx: 17,

    backgroundColor: {
        table: '#d9d9d9',
        header: '#d9d9d9',
        body: '#d9d9d9',
        tableFooter: '#d9d9d9',
        footer: '#d9d9d9',
    },
    tablePadding: '10px',

    pagination: {
        visible: true,
        width: 200
    }
}

export const DEFAULT_VALUES = {
    fetchData: {
        method: async () => Promise.resolve([]),
        bodyDataKey: 'body',
        footerDataKey: 'footer'
    }
}


export const DEFAULT_CSS_CLASS_NAMES = {
    // header: 'thead',
    // body: 'tbody',
    // tableFooter: 'tfoot',
    // footer: 'footer',
    // row: 'row',
    column: 'col_',
    columnSz: 'colSz_',
    columnDc: 'colDc_'
}

export const CLASS_NAMES = {
    table: 'Table',
    header: 'Header',
    body: 'Body',
    tableFooter: 'TableFooter',
    footer: 'Footer',
    row: 'Row',
    column: 'Column'
}

export const CHROME_CONTAINER_PADDING = '17px'
