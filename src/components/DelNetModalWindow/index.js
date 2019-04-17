import React, {Fragment, Component} from 'react'
import PropTypes from 'prop-types'
import check from 'check-types'
import custCss from './style.module.css'
import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep'
import {Row, Col, Button, Modal, ModalBody, ModalFooter, ModalHeader, } from 'react-bootstrap'

import Input2 from '../Base/Input2'
import Select from '../Base/Select'
import {NET_DATA_URL, VRF_LIST_URL, NET_SUBMIT_URL} from'../../constants/IpamTable'

class DelNetModalWindow extends Component {
    /**
      * @typedef {{
      *     vrf_id: number,
      *     vrf_name: string,
      *     vrf_rd: string
      *     vrf_comment: string
      * }} Vrf
      */
    /**
     * @typedef {{
     *     value: number,
     *     label: string
     * }} VrfListItem
     */

    /**
     * @type {{
     *     netIp: string,
     *     netComment: string,
     *     dataLoading: boolean,
     *     dataReady: boolean,
     *     saving: boolean,
     *     vrfId: string|number,
     *     vrfList: VrfListItem[]
     * }} state
     */
    state = {
        netIp: '',
        netComment: '',
        dataLoading: false,
        dataReady: false,
        saving: false,
        vrfId: '',
        vrfList: []
    }

    initialNetData = {}

    clearStateIfGetInvisible = ((prevVisibleState) => () => {
        if (prevVisibleState !== this.props.isVisible) {
            prevVisibleState = this.props.isVisible
            if (this.props.isVisible === false) this.clearState()
        }
    })(this.props.isVisible)


    clearState = ((initialState) => () => {
        console.log('INITIAL STATE', initialState)
        this.setState(cloneDeep(initialState))
    })(cloneDeep(this.state))

    vrfList = ((prevVrfData, prevList) => (vrfData) => {
        if (JSON.stringify(prevVrfData) === JSON.stringify(vrfData))  return prevList
        if (check.not.array(vrfData)) return prevList
        prevVrfData = vrfData
        prevList = vrfData.map((vrf) => {
            const {vrf_id, vrf_rd, vrf_name, vrf_comment} = vrf
            return {value: vrf_id, label: vrf_name}
        })
        return prevList
    })([], [])

    handleClose = () => {
        this.props.onClose()
    }
    dataValidate = () => {
        const errors = []
        const {netIp, vrfId} = this.state
        if (check.emptyString(netIp)) errors.push('Не указан адрес подсети')
        if (check.emptyString(vrfId)) errors.push('Не выбран VRF')
        return errors
    }
    editedNetData = () => {
        const {netIp, netComment, vrfId} = this.state
        const {newNet, netId} = this.props
        return {
            newNet,
            netId,
            netIp,
            netComment,
            vrfId
        }
    }

    handleSubmit = async() => {
        const errors = this.dataValidate()
        if (check.nonEmptyArray(errors)) {
            alert(errors.join("\n"))
            return
        }
        try {
            this.setState({saving: true})
            /**
             * @typedef {{
             *     code: number,
             *     message: string
             * }} Error
             * @type {{
             *     errors: Error[]
             * }} res
             */
            const res = await axios.post(NET_SUBMIT_URL, this.editedNetData())
            const {data} = res
            if (data.errors) throw data.errors.join("\n")
            this.setState({saving: false})
            console.log('SAVE RESULT', data.result)
            if (this.onSubmit) {
                this.onSubmit()
            } else {
                console.log('function onSubmit is not defined')
            }
            setTimeout(() => {this.handleClose()}, 700)
        } catch (e) {
            console.log('ERROR: ', e)
            alert(e)
            this.setState({saving: false})
        }
    }

    fetchNetData = async (netId) => {
        try {

            const res = await axios.get(NET_DATA_URL, {
                params: {netId}
            })
            const {data} = res
            if (!data.netData) {
                console.log('ERROR: fetchNetworkData')
                return {}
            }
            return data
        } catch (e) {
            console.log('ERROR: fetchNetworkData', e.toString())
            return {}
        }
    }
    fetchVrfList = async () => {
        try {
            const res = await axios.get(VRF_LIST_URL, {
                params: {}
            })
            const {data} = res
            if (!data.vrfList) {
                console.log('ERROR: fetchVrfList')
                return []
            }
            return data
        } catch (e) {
            console.log('ERROR: fetchVrfList', e.toString())
            return []
        }
    }
    ipFormat = (value) => {
        const reg = new RegExp('^[0-9./]*$')
        return reg.test(value)
    }
    onChangeNetIp = (e) => {
        if (!(this.ipFormat(e.target.value))) return
        this.setState({netIp: e.target.value})
    }
    onChangeNetComment = (e) => {
        this.setState({netComment: e.target.value})
    }
    onChangeVrf = ({value}) => {
        this.setState({vrfId: value})
    }

    render() {
        const {isVisible, netId, newNet} = this.props
        const {dataReady, dataLoading, vrfList, vrfId, netIp, netComment} = this.state
        const modalBody = () => {
            if (!isVisible || !dataReady) return null
            if (dataLoading) return <h3 align="center">Загрузка данных...</h3>

            return (
                <Fragment>
                    <Row>
                        <Col md={4}><Input2 controlId='networkIp' addOnPosition="left" addOnText="network IP" onChange={this.onChangeNetIp} label="Адрес подсети" value={netIp} placeholder='CIDR notation'/></Col>
                        <Col md={8}><Input2 controlId='netComment' label="Комментарий" onChange={this.onChangeNetComment} value={netComment} placeholder='Комментарий для подсети'/></Col>
                    </Row>
                    <Row>
                        <Col md={4}><Select label="VRF" optionList={vrfList} defaultSelected={vrfId} onChange={this.onChangeVrf} /></Col>
                    </Row>
                </Fragment>
            )
        }
        const modalTitle = () => newNet ? 'Новая подсеть' : 'Редактирование подсети'
        return (
            <Modal show={isVisible} onHide={this.handleClose} bsSize="large" >
                <ModalHeader closeButton>
                    <Modal.Title>{modalTitle()}</Modal.Title>
                </ModalHeader>
                <ModalBody className={custCss.modalBody} >
                    {modalBody()}
                </ModalBody>
                <ModalFooter>
                    <Row>
                        <Col md={8}>
                            <h3 align="center" style={{margin: 0}}>{this.state.saving ? 'Сохранение данных...' : ''}</h3>
                        </Col>
                        <Col md={4}>
                            <Button onClick={this.handleClose} bsStyle="danger" disabled={this.state.saving} >Отмена</Button>
                            <Button onClick={this.handleSubmit} bsStyle="success" disabled={this.state.saving}>Сохранить</Button>
                        </Col>
                    </Row>
                </ModalFooter>
            </Modal>
        )
    }

    async componentDidMount() {
    }

    async componentDidUpdate() {
        this.clearStateIfGetInvisible()
        const {netId, newNet, isVisible} = this.props
        // this.updateStateFromProps()
        const {dataReady, dataLoading} = this.state
        if (isVisible && netId && !newNet && !dataReady && !dataLoading) {
            this.setState({dataLoading: true})
            try {
                const response1 = await Promise.all([
                    this.fetchNetData(netId),
                    this.fetchVrfList(),
                ])
                console.log(response1)
                const [{netData}, {vrfList: vrfRawData}] = response1
                const {net_ip: netIp, net_comment: netComment, vrf_id: vrfId} = netData
                this.initialNetData = netData
                const vrfList = this.vrfList(vrfRawData)
                console.log('NET VRF', vrfList)
                this.setState({dataLoading: false, dataReady: true, netIp, netComment, vrfId, vrfList})
            } catch (e) {
                console.log('Loading net data ERROR', e.toString())
            }

        } else if (isVisible && newNet && !dataReady && !dataLoading) {
            this.setState({dataLoading: true})
            const response1 = await this.fetchVrfList()
            const {vrfList: vrfRawData} = response1
            const vrfList = this.vrfList(vrfRawData)
            console.log('NET VRF', vrfList)
            this.setState({dataLoading: false, dataReady: true, vrfList})
        }
    }
}

DelNetModalWindow.propTypes = {
    isVisible: PropTypes.bool,
    netId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isDeleteAvailable: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func, //only if saving updated data is successful, this be invoked (if you need update table after store data i.e.)
}
DelNetModalWindow.defaultProps = {
    isVisible: false
}

export default DelNetModalWindow
