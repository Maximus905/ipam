import React from 'react'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import logo from '../../img/logo_brs_small.png'
import styles from './navBar.module.css'
// import CSSModules from 'react-css-modules'
import * as URL from './URLs'

const imgStyle = {
    width: 38
}

const AppNavbar = () => {
    return (
        <Navbar fluid>
            <Navbar.Header>
                <Navbar.Brand className={styles.customHeader} >
                    <a href={URL.root}><img src={logo} style={imgStyle} alt="img"/></a>
                </Navbar.Brand>
            </Navbar.Header>

            <Nav>
                <NavItem eventKey={1} href={URL.offices}>
                    Офисы
                </NavItem>
                <NavItem eventKey={2} href={URL.devices}>
                    Оборудование
                </NavItem>
                <NavDropdown eventKey={3} title="IP Planing" id="basic-nav-dropdown-1">
                    <MenuItem eventKey={3.1} href={URL.ip_ipam}>IPAM</MenuItem>
                </NavDropdown>
                <NavItem eventKey={4} href={URL.reports}>
                    Reports
                </NavItem>
                <NavDropdown eventKey={5} title="Phone Reports" id="basic-nav-dropdown-1">
                    <MenuItem eventKey={5.1} href={URL.reportPhoneByModels}>По моделям</MenuItem>
                    <MenuItem eventKey={5.2} href={URL.reportPhoneByClusters}>По кластерам</MenuItem>
                    <MenuItem eventKey={5.3} href={URL.reportPhoneByNotUsed}>По неиспользуемым</MenuItem>
                </NavDropdown>

            </Nav>

            <Nav pullRight>
                <NavDropdown eventKey={6} title="Справочники" id="basic-nav-dropdown-2">
                    <MenuItem eventKey={6.1} href={URL.dictRegions}>Регионы</MenuItem>
                    <MenuItem eventKey={6.2} href={URL.dictCities}>Города</MenuItem>
                    <MenuItem eventKey={6.3} href={URL.dictOffice_stats}>Статусы офисов</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey={6.1} href={URL.dictDevices}>Оборудование</MenuItem>
                    <MenuItem eventKey={6.2} href={URL.dictPortTypes}>Типы портов</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey={6.1} href={URL.HwLogs}>Логи Hardware</MenuItem>
                    <MenuItem eventKey={6.2} href={URL.PhonesLogs}>Логи Phones</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey={6.4} href={URL.dictVRFs}>VRF</MenuItem>
                    <MenuItem eventKey={6.4} href={URL.dictNetworksTable}>Networks(Table)</MenuItem>
                </NavDropdown>
            </Nav>
        </Navbar>
    )
}

export default AppNavbar
