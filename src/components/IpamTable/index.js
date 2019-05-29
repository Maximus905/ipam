import React, {Component, Fragment} from 'react'
import {connectAdvanced} from 'react-redux'
import PropTypes from 'prop-types'
// import {check} from 'check-types'
import {
    invalidateElements,
    forceUpdateRootElements,
    forceUpdateRootElementsIds,
    fetchElementsIfNeeded,
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
import {ContextMenu, MenuItem} from "react-contextmenu"
import './contextMenu.css'
import NetModalWindow from '../NetModalWindow'


class IpamTable extends Component {

    state = {
        isNetModalVisible: false,
        newNet: true,
        delNet: false,
        netId: ''
    }

    onCloseNetModal = () => {
        this.setState({
            isNetModalVisible: false,
            netId: ''
        })
    }

    onSubmitNetData = async (prevNetData, newNetData) => {
        const netIds = new Set()
        if (newNetData.netId) netIds.add(newNetData.netId)
        netIds.add(newNetData.parentNetId)
        if (prevNetData) {
            if (prevNetData.delNet === false) netIds.add(prevNetData.netId)
            netIds.add(prevNetData.parentNetId)
        }
        this.props.invalidateElementsInStore([...netIds].filter(item => item !== false), [])
        //TODO remove deleted elements from store
        if (netIds.has(false)) this.props.forceUpdateRootItems()
    }

    factory = new FilterFactory()

    onChangeFiltersState = async (filterStatements) => {
        const {updateFilterStore} = this.props
        try {
            let response = await axios.post(URL_FILTERED_SEARCH, filterStatements)
            const {searchResult = []} = response.data

            updateFilterStore({searchResult})
        } catch (error) {
            console.log('Error: ', error.response)
        }
    }

    filter = this.factory.createFilter('simpleSearch', [{"nets": ["net_ip", "net_comment", "vrf_name", "vrf_comment", "net_location"]}, {"host_ports": [""]}], {width: '200px', defaultStatement: 'beginWith', minLengthForSearch: 3, placeholder: 'Search...', hideUnusedRows: false})
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
        const {filteredItemsList, showCurrentFilteredItem, restoreStateFromFilter, setFilterCursor, filterCursor, currentFilteredItem} = this.props

        window.fact = this.factory

        return (
            <Fragment>
                <Table width={'100%'} data={data} formBodyData={this.renderBodyData} fetchData={this.fetchData} scrollPosition={currentFilteredItem} >
                    <Header>
                        <Row>
                            <Column accessor={''} minWidth={'200px'} maxWidth={'400px'}>IP address</Column>
                            <Column accessor={''} minWidth={'100px'} fixed>Statistics<br/>(Nets/Hosts)</Column>
                            <Column accessor={''} minWidth={'130px'} fixed>Network mask</Column>
                            <Column accessor={''} minWidth={'200px'} maxWidth={'500px'}>Locations</Column>
                            <Column accessor={''} minWidth={'100px'} maxWidth={'300px'}>Comment</Column>
                            <Column accessor={''} minWidth={'150px'} maxWidth={'300px'}>Интерфейс</Column>
                            <Column accessor={''} minWidth={'150px'} maxWidth={'300px'}>Оборудование</Column>
                            <Column accessor={''} minWidth={'80px'} fixed>VRF</Column>
                            <Column accessor={''} minWidth={'80px'} fixed>AS</Column>
                            <Column accessor={''} minWidth={'100px'} fixed>Тип</Column>
                            <Column accessor={''} minWidth={'200px'} maxWidth={'300px'}>Hostname</Column>
                            <Column accessor={''} minWidth={'100px'} maxWidth={'300px'}>DNS</Column>
                        </Row>
                    </Header>
                    <Body />
                    <Footer>
                        <div style={{display: 'flex'}}>
                            {this.filter}
                            {/*<Pagination3 filteredItemsList={filteredItemsList} onChange={this.props.showCurrentFilteredItem} />*/}
                            <Pagination3 filteredItemsList={filteredItemsList} onChange={showCurrentFilteredItem} onNewItemsList={restoreStateFromFilter} onHideFilter={restoreStateFromFilter} setFilterCursor={setFilterCursor} filterCursor={filterCursor} />
                        </div>
                        <div> </div>
                    </Footer>
                </Table>
                <ContextMenu id={"headerTable"}>
                    <MenuItem data={{foo: 'bar'}} onClick={(e, data) => {console.log(data)}}>
                        Net Item 1
                    </MenuItem>
                </ContextMenu>
                <ContextMenu id={"netRowMenu"}>
                    <MenuItem onClick={(e, data) => {
                        this.setState({
                            isNetModalVisible: true,
                            netId: data.id,
                            newNet: false,
                            delNet: false
                        })
                    }}>
                        Редактировать подсеть
                    </MenuItem>
                    <MenuItem onClick={(e, data) => {
                        this.setState({
                            isNetModalVisible: true,
                            netId: '',
                            newNet: true,
                            delNet: false
                        })
                    }}>
                        Создать подсеть
                    </MenuItem>
                    <MenuItem onClick={(e, data) => {
                        this.setState({
                            isNetModalVisible: true,
                            netId: data.id,
                            newNet: false,
                            delNet: true
                        })
                    }}>
                        Удалить подсеть
                    </MenuItem>
                </ContextMenu>
                <ContextMenu id={"hostRowMenu"}>
                    <MenuItem onClick={(e, data) => {
                        this.setState({
                            isNetModalVisible: true,
                            netId: '',
                            newNet: true,
                            delNet: false
                        })
                    }}>
                        Создать подсеть
                    </MenuItem>
                </ContextMenu>
                <NetModalWindow isVisible={this.state.isNetModalVisible} newNet={this.state.newNet} delNet={this.state.delNet} netId={this.state.netId} onClose={this.onCloseNetModal} onSubmit={this.onSubmitNetData} />
            </Fragment>

        );
    }

    async componentDidMount() {
        this.factory.subscribe(this.onChangeFiltersState);
        const {forceUpdateRootItems} = this.props
        forceUpdateRootItems()
    }
}


    function selectorFactory(dispatch) {
        // let result = {}
        function forceUpdateRootItems () {
            dispatch(forceUpdateRootElements())
        }
        function forceUpdateRootIds () {
            dispatch (forceUpdateRootElementsIds())
        }
        function invalidateElementsInStore(netsIds, hostsIds) {
            dispatch(invalidateElements({netsIds, hostsIds}))
        }
        function updateFilterStore ({searchResult}) {
            dispatch(setFilter({searchResult}))
        }
        function setFilterCursor (position) {
            dispatch(setCursor(position))
        }
        function showCurrentFilteredItem (idx) {
            dispatch(showFilteredItem(idx))
            console.log('show', this)
        }
        function restoreStateFromFilter () {
            dispatch(restoreSavedStates())
        }
        function getCurrentFilteredItem (state) {
            const filteredItemsList = getFilterItemList(state)
            const filterCursor = getFilterCursor(state)
            // console.log(filteredItemsList, filterCursor, filteredItemsList[filterCursor])
            if (filteredItemsList && filteredItemsList.length && filteredItemsList.length > 0) {
                return filteredItemsList[filterCursor]
            }
            return {}
        }
        return (state, ownProps) => {
            const {netsIds, hostsIds} = getRootIds(state)
            const filterStore = getFilterResults(state)
            const filteredItemsList = getFilterItemList(state)
            const filterCursor = getFilterCursor(state)
            const currentFilteredItem = getCurrentFilteredItem(state)
            const result = {
                forceUpdateRootItems,
                forceUpdateRootIds,
                invalidateElementsInStore,
                updateFilterStore,
                setFilterCursor,
                showCurrentFilteredItem,
                getCurrentFilteredItem,
                restoreStateFromFilter,
                filterStore,
                filteredItemsList,
                filterCursor,
                currentFilteredItem,
                netsIds,
                hostsIds
            }
            return result
        }
}


IpamTable.propTypes = {
    //from dispatchToProps
    forceUpdateRootItems: PropTypes.func,
    forceUpdateRootIds: PropTypes.func,
    invalidateElementsInStore: PropTypes.func,
    updateRootElementsId: PropTypes.func,
    updateElements: PropTypes.func,
    updateFilterStore: PropTypes.func,
    setFilterCursor: PropTypes.func,
    currentFilteredItem: PropTypes.shape({
        id: PropTypes.number,
        ip: PropTypes.string,
        rec_type: PropTypes.string,
        ip_path: PropTypes.string
    }),
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