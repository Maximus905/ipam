import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

class ScrollTo extends PureComponent {

    render() {
        return (
            <div>

            </div>
        )
    }
}

ScrollTo.propTypes = {
    scrollArea: PropTypes.shape({current: PropTypes.instanceOf(Element)}),
    element: PropTypes.shape({current: PropTypes.instanceOf(Element)}),
    alignment: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    offset: PropTypes.number, //outer side offset in px
    direction: PropTypes.oneOf(['y', 'Y', 'x', 'X'])
}

ScrollTo.defaultProps = {
    alignment: 'top',
    offset: 0,
    direction: 'y'
}
export default ScrollTo