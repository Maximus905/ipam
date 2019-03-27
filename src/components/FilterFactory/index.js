import React from 'react'
// import PropTypes from 'prop-types'
import SimpleSearch from "./SimpleSearch"
import check from 'check-types'

class FilterFactory {

    filtersStore = []
    listeners = []
    statementSet = {
        '=': '=',
        '!=': '!=',
        '>': '>',
        '>=': '>=',
        '<': '<',
        '<=': '<=',
        'beginWith': 'begin with',
        'endWith': 'end with',
        'empty': 'empty',
        'notEmpty': 'not empty'
    }

    subscribe = (callBack) => {
        if (! check.function(callBack)) return
        const listenerId = this.listeners.length
        this.listeners.push(callBack)
        return listenerId
    }
    unsubscribe = (listenerID) => {
        if (! this.listeners[listenerID]) return false
        delete this.listeners[listenerID]
        return true
    }

    updateFilterState = (id, filtersStore) => (state) => {
        if (check.emptyObject(state)) {
            if (check.emptyObject(filtersStore[id])) return
            filtersStore[id] = {}
        } else {
            const {searchBy, statement, value} = state
            filtersStore[id] = Object.assign({}, filtersStore[id], {searchBy, statement, value})
        }
        //invoke listener's functions
        for (const listener of this.listeners) {
            listener(filtersStore)
        }
    }

    /**
     *
     * @param filterType
     * @param accessorList
     * @param {Object} options
     * @param {String} options.width
     * @param {String} options.defaultStatement
     * @param {Number} options.minLengthForSearch
     * @param {String} options.placeholder
     * @param {Boolean} options.hideUnusedRows
     * @returns {*}
     */
    createFilter = (filterType, accessorList, options) => {
        const filterProps = {accessorList, ...options}
        //check defaultStatement is correct
        if (Object.keys(this.statementSet).indexOf(filterProps.defaultStatement) < 0 ) {
            console.log('--- incorrect default statement for filter: ', filterProps.defaultStatement)
            return
        }
        switch (filterType) {
            case 'simpleSearch':
                const filterId = this.filtersStore.length
                this.filtersStore[filterId] = {}
                return <SimpleSearch
                    {...filterProps}
                    updateFilterState={this.updateFilterState(filterId, this.filtersStore)}
                    statementSet={this.statementSet}
                />
            default:
        }
    }
}

FilterFactory.propTypes = {}

export default FilterFactory