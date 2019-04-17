import React, {Fragment, Component} from 'react'
import PropTypes from 'prop-types'
import check from 'check-types'
import custCss from './style.module.css'
import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep'
import {Row, Col, Button, Modal, ModalBody, ModalFooter, ModalHeader, } from 'react-bootstrap'

import Input2 from '../Base/Input2'
import Select from '../Base/Select'
import {NET_DATA_URL, VRF_LIST_URL, NET_SUBMIT_URL, GET_NET_PARENT} from '../../constants/IpamTable'

class NetModalWindow extends Component {
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
    currentNetData = () => {
        const {netIp, netComment, vrfId} = this.state
        const {delNet, newNet, netId} = this.props
        return {
            delNet,
            newNet,
            netId,
            netIp,
            netComment,
            vrfId
        }
    }

    getParentNetworkId = async (netId) => {
        let res = {}
        try {
            const response = await axios.get(GET_NET_PARENT,{
                params: {netId}
            })
            if (res.errors) {
                throw new Error('Error update tree after saving data!')
            }
            const {parentNetId} = response.data
            res = {parentNetId}
        } catch (e) {
            res.errors = [e]
        }
        return res
    }


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

    handleSubmit = async() => {
        const errors = this.dataValidate()
        if (check.nonEmptyArray(errors)) {
            alert(errors.join("\n"))
            return
        }
        try {
            this.setState({saving: true})

            const result = await axios.post(NET_SUBMIT_URL, this.currentNetData())
            const {data} = result
            if (data.errors) throw data.errors.join("\n")
            this.setState({saving: false})
            console.log('SAVE RESULT', data.result, data)

            const {netId, parentNetId} = data
            this.props.onSubmit(this.initialNetData, {...this.currentNetData(), netId, parentNetId})
            setTimeout(() => {this.handleClose()}, 700)
        } catch (e) {
            console.log('ERROR: ', e)
            alert(e)
            this.setState({saving: false})
            if (this.currentNetData().delNet) {
                setTimeout(() => {this.handleClose()}, 700)
            }
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
        const {isVisible, netId, newNet, delNet} = this.props
        const {dataReady, dataLoading, vrfList, vrfId, netIp, netComment} = this.state
        const modalBody = () => {
            if (!isVisible || !dataReady) return null
            if (dataLoading) return <h3 align="center">Загрузка данных...</h3>
            if (delNet) {
                return (
                    <Row>
                        <Col md={12}>
                            <h3 className="text-center">Подтвердите удаление подсети <strong><mark>{netIp}</mark></strong></h3>
                        </Col>
                    </Row>
                )
            }
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
        const modalTitle = () => delNet ? 'Удаление подсети' : (newNet ? 'Новая подсеть' : 'Редактирование подсети')
        if (delNet) {
            return (
                <Modal show={isVisible} onHide={this.handleClose} >
                    <ModalHeader closeButton>
                        <Modal.Title>{modalTitle()}</Modal.Title>
                    </ModalHeader>
                    <ModalBody className={custCss.modalBodySmall} >
                        {modalBody()}
                    </ModalBody>
                    <ModalFooter>
                        <Row>
                            <Col md={8}>
                                <h3 align="center" style={{margin: 0}}>{this.state.saving ? 'Удаление...' : ''}</h3>
                            </Col>
                            <Col md={4}>
                                <Button onClick={this.handleClose} bsStyle="danger" disabled={this.state.saving} >Отмена</Button>
                                <Button onClick={this.handleSubmit} bsStyle="success" disabled={this.state.saving}>Удалить</Button>
                            </Col>
                        </Row>
                    </ModalFooter>
                </Modal>
            )
        }
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
        const {netId, newNet, delNet, isVisible} = this.props
        // this.updateStateFromProps()
        const {dataReady, dataLoading} = this.state
        if (isVisible && netId && !newNet && !delNet && !dataReady && !dataLoading) {
            this.setState({dataLoading: true})
            try {
                const response1 = await Promise.all([
                    this.fetchNetData(netId),
                    this.fetchVrfList(),
                    this.getParentNetworkId(netId)
                ])
                const [{netData}, {vrfList: vrfRawData}, {parentNetId}] = response1
                const {net_ip: netIp, net_comment: netComment, vrf_id: vrfId} = netData
                this.initialNetData = ((serverData, parentNetId) => {
                    const {net_id, net_ip, net_comment, vrf_id} = serverData
                    return {
                        parentNetId,
                        netId: net_id,
                        netIp: net_ip,
                        netComment: net_comment,
                        vrfId: vrf_id
                    }
                })(netData, parentNetId)
                const vrfList = this.vrfList(vrfRawData)
                this.setState({dataLoading: false, dataReady: true, netIp, netComment, vrfId, vrfList})
            } catch (e) {
                console.log('Loading net data ERROR', e.toString())
            }

        } else if (isVisible && newNet && !dataReady && !dataLoading) {
            this.setState({dataLoading: true})
            this.initialNetData = null
            const response1 = await this.fetchVrfList()
            const {vrfList: vrfRawData} = response1
            const vrfList = this.vrfList(vrfRawData)
            console.log('NET VRF', vrfList)
            this.setState({dataLoading: false, dataReady: true, vrfList})
        } else if (isVisible && delNet && !dataReady && ! dataLoading) {
            this.setState({dataLoading: true})
            const response = await Promise.all([
                this.fetchNetData(netId),
                this.getParentNetworkId(netId)
            ])
            const [{netData}, {parentNetId}] = response
            const {net_ip: netIp, net_comment: netComment, vrf_id: vrfId} = netData
            this.initialNetData = ((serverData, parentNetId) => {
                const {net_id, net_ip, net_comment, vrf_id} = serverData
                return {
                    parentNetId,
                    netId: net_id,
                    netIp: net_ip,
                    netComment: net_comment,
                    vrfId: vrf_id
                }
            })(netData, parentNetId)
            this.setState({dataLoading: false, dataReady: true, netIp, netComment, vrfId})
        }
    }
}

NetModalWindow.propTypes = {
    isVisible: PropTypes.bool,
    netId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    newNet: PropTypes.bool, // set mode of creation network
    delNet: PropTypes.bool, // set mode of delete network
    onClose: PropTypes.func,
    onSubmit: PropTypes.func, //only if saving updated data is successful, this be invoked (if you need update table after store data i.e.)
    onCreateSubmit: PropTypes.func, //only if saving new network is successful, this be invoked (if you need update table after store data i.e.)
}
NetModalWindow.defaultProps = {
    isVisible: false,
    onSubmit: (prevNetData, updatedNetData) => {
        console.log(prevNetData, updatedNetData)
    }
}

export default NetModalWindow
