import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {MIN_SEARCH_LENGTH, SEARCH_TIMEOUT} from './constants'

/**
 * in this class is used customized bootstrap classes
 */
class SimpleSearch extends PureComponent {
    state = {
        searchBy: this.props.accessorList,
        statement: this.props.defaultStatement,
        value: ''
    }
    timerId = ''

    isEmpty = ((minSearchLength) => (filterState) => {
        switch (filterState.statement) {
            case '=':
            case '!=':
            case '>':
            case '>=':
            case '<':
            case '<=':
            case 'beginWith':
            case 'endWith':
                return filterState.value.length < minSearchLength
            default:
                return true
        }
    })(MIN_SEARCH_LENGTH)

    //update state of this filter in filters store of Filter factory
    updateParentState = () => {
        if (this.isEmpty(this.state)) {
            this.props.updateFilterState({})
        } else {
            this.props.updateFilterState(this.state)
        }
    }

    onChangeHandler = (e) => {
        this.setState({value: e.target.value})
    }


    render() {
        const {width, placeholder} = this.props
        const style = {width}

        return (
            <div>
                <input className='search-bar-form-control' style={style} placeholder={placeholder} value={this.state.value} onChange={this.onChangeHandler} />
            </div>
        )
    }

    componentDidUpdate() {
        if (this.timerId) clearTimeout(this.timerId)
        this.timerId = setTimeout(this.updateParentState, SEARCH_TIMEOUT)
    }
}

SimpleSearch.propTypes = {
    accessorList: PropTypes.array.isRequired,
    defaultStatement: PropTypes.string,
    minLengthForSearch: PropTypes.number,
    options: PropTypes.shape({
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }),
    placeholder: PropTypes.string,
    hideUnusedRows: PropTypes.bool,
    updateFilterState: PropTypes.func,
    statementSet: PropTypes.object.isRequired,
}

SimpleSearch.defaultProps = {
    defaultStatement: '=',
    minLengthForSearch: MIN_SEARCH_LENGTH,
    options: {
        width: '150px'
    },
    placeholder: 'search....'
}

export default SimpleSearch