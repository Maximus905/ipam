import React, {Component} from 'react'
import {connectAdvanced} from 'react-redux'
import PropTypes from 'prop-types'
// import {check} from 'check-types'
import isEqual from 'lodash/isEqual'
import {
    invalidateElements,
    fetchElementsIfNeeded,
    forceUpdateRootElements,
    forceUpdateRootElementsIds,
    setFilter,
    setCursor,
} from '../../actions'

import {showFilteredItem, restoreSavedStates} from '../../actions'

import Table from '../Table'
import {Header, Body, Row, Column, Footer, Pagination3} from '../Table'
import RowsContainer from './RowsContainer'
import {getRootIds, getFilterResults, getFilterItemList, getFilterCursor} from './selectors'
import FilterFactory from '../FilterFactory'
import axios from 'axios'
import {URL_FILTERED_SEARCH} from '../../constants/IpamTable'


class IpamTable extends Component {

    factory = new FilterFactory()

    onChangeFiltersState = async (filterStatements) => {
        const {updateFilterStore} = this.props
        try {
            // let config = {
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // };
            let response = await axios.post(URL_FILTERED_SEARCH, filterStatements)
            const {searchResult = []} = response.data

            updateFilterStore({searchResult})
        } catch (error) {
            console.log('Error: ', error.response)
        }
    }

    filter = this.factory.createFilter('simpleSearch', ['ip'], {width: '200px', defaultStatement: 'beginWith', minLengthForSearch: 3, placeholder: 'Search...', hideUnusedRows: false})
    // filter2 = this.factory.createFilter('simpleSearch', ['ip', 'net_ip', 'office'], {width: '200px', defaultStatement: 'beginWith', minLengthForSearch: 3, placeholder: 'Search...', hideUnusedRows: false})


    renderBodyData = function(data){
        const {netsIds = [], hostsIds = []} = data
        return (
            <React.Fragment>
                <RowsContainer netsIds={netsIds} hostsIds={hostsIds} lvl={0} />
            </React.Fragment>
        )
    }

    render() {
        const data = {body: {netsIds: this.props.netsIds, hostsIds: this.props.hostsIds}}
        const {filteredItemsList} = this.props

        window.fact = this.factory

        return (
            <Table width={'100%'} data={data} formBodyData={this.renderBodyData} fetchData={this.fetchData} >
                <Header>
                    <Row>
                        <Column accessor={'address'} minWidth={'200px'} maxWidth={'400px'}>IP address</Column>
                        <Column accessor={'mask'} minWidth={'100px'} fixed>Statistics<br/>(Nets/Hosts)</Column>
                        <Column accessor={'mask'} minWidth={'130px'} fixed>Network mask</Column>
                        <Column accessor={'tags'} minWidth={'100px'} maxWidth={'200px'}>Tags</Column>
                        <Column accessor={'locations'} minWidth={'200px'} maxWidth={'500px'}>Locations</Column>
                        <Column accessor={'vrf'} minWidth={'80px'} fixed>VRF</Column>
                        <Column accessor={'vrf'} minWidth={'60px'} fixed>VLAN</Column>
                        <Column accessor={'vrf'} minWidth={'60px'} fixed>vxlan vni</Column>
                        <Column accessor={'comment'} minWidth={'100px'} maxWidth={'500px'}>Comment</Column>
                    </Row>
                </Header>
                <Body />
                <Footer>
                    <div style={{display: 'flex'}}>
                        {this.filter}
                        {/*<Pagination3 filteredItemsList={filteredItemsList} onChange={this.props.showCurrentFilteredItem} />*/}
                        <Pagination3 filteredItemsList={filteredItemsList} onChange={this.props.showCurrentFilteredItem} onNewItemsList={this.props.restoreStateFromFilter} onHideFilter={this.props.restoreStateFromFilter} />
                    </div>
                    <div> </div>
                </Footer>
            </Table>
        );
    }

    async componentDidMount() {
        this.factory.subscribe(this.onChangeFiltersState);
        const {forceUpdateRootItems} = this.props
        forceUpdateRootItems()
    }
}


    function selectorFactory(dispatch) {
        let result = {}
        function forceUpdateRootItems () {
            dispatch(forceUpdateRootElements())
        }
        function forceUpdateRootIds () {
            dispatch (forceUpdateRootElementsIds())
        }
        // function updateElements ({netsIds, hostsIds}) {
        //     dispatch(fetchElementsIfNeeded({netsIds, hostsIds}))
        // }
        // function forceUpdateElements ({netsIds, hostsIds}) {
        //     dispatch(invalidateElements({netsIds, hostsIds}))
        //     dispatch(fetchElementsIfNeeded({netsIds, hostsIds}))
        // }
        function updateFilterStore ({searchResult}) {
            dispatch(setFilter({searchResult}))
        }
        function setFilterCursor (position) {
            dispatch(setCursor(position))
        }
        function showCurrentFilteredItem (idx) {
            dispatch(showFilteredItem(idx))
        }
        function restoreStateFromFilter () {
            dispatch(restoreSavedStates())
        }
        return (state, ownProps) => {
            const {netsIds, hostsIds} = getRootIds(state)
            const filterStore = getFilterResults(state)
            const filteredItemsList = getFilterItemList(state)
            const filterCursor = getFilterCursor(state)
            const nextResult = {
                forceUpdateRootItems,
                forceUpdateRootIds,
                updateFilterStore,
                setFilterCursor,
                showCurrentFilteredItem,
                restoreStateFromFilter,
                filterStore,
                filteredItemsList,
                filterCursor,
                netsIds,
                hostsIds
            }
            if (!isEqual(result, nextResult)) result = nextResult
            return result
        }
}


IpamTable.propTypes = {
    //from dispatchToProps
    forceUpdateRoot: PropTypes.func,
    forceUpdateRootIds: PropTypes.func,
    updateRootElementsId: PropTypes.func,
    updateElements: PropTypes.func,
    updateFilterStore: PropTypes.func,
    setFilterCursor: PropTypes.func,
    showCurrentFilteredItem: PropTypes.func,
    filterStore: PropTypes.object,
    filteredItemsList: PropTypes.array,
    filterCursor: PropTypes.number,

    //from stateToProps
    rootnetsIds: PropTypes.array,
    rootHostsId: PropTypes.array,
};
IpamTable.defaultProps = {
    rootnetsIds: [],
    rootHostsId: []
};


export default connectAdvanced(selectorFactory)(IpamTable)