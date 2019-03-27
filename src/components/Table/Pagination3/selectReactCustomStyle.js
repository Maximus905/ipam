const customStyles = {
    option: (base, state) => {
        return ({
            ...base,
            padding: "2px 5px",
        })
    },
    container: (base, state) => {
        return ({
            ...base,
        })
    },
    control: (base, state) => {
        return ({
            ...base,
            minHeight: 15,
        })
    },
    dropdownIndicator: (base, state) => {
        return ({
            ...base,
            padding: 0
        })
    },
    input: (base, state) => {
        return ({
            ...base,
            margin: 0,
            padding: 0
        })
    },
}
export default customStyles