import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {tableConnect} from '../TableContext'

class Footer extends PureComponent {
    innerStyles = (tableContext) => {
        const {jssSheet: {classes: css}} = tableContext
        return [css.footerContainer, css.footerContainerDc]
    }

    render() {
        const {tableContext} = this.props
        return (
            <div className={this.innerStyles(tableContext).join(" ")}>
                {this.props.children}
            </div>
        )
    }
}

Footer.propTypes = {
    pagination: PropTypes.bool
};
Footer.defaultProps = {
    pagination: true
};

export default tableConnect(Footer);
