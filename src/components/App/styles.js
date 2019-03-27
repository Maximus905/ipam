const styles = {
    app: {
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr auto',
        gridTemplateAreas: "'header' 'body' 'footer'",

        msGridColumns: '1fr',
        msGridRows: 'auto 1fr auto',
    },
    header: {
        gridArea: 'header',

        msGridRow: 1,
        msGridColumn: 1
    },
    body: {
        gridArea: 'body',
        overflowY: 'auto',
        msGridRow: 2,
        msGridColumn: 1,
    },
    footer: {
        gridArea: 'footer',

        msGridRow: 3,
        msGridColumn: 1
    }
}
export default styles