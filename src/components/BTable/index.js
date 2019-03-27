import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import st from'./style.css'

class BTable extends PureComponent {
    render() {
        return (
            <div>
                <table className={['table', 'table-striped', 'table-hover'].join(' ')}>
                    <thead>
                        <tr className={'bg-primary'}>
                            <th width="100px">h1</th>
                            <th width="200px">h2</th>
                            <th>h3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='form-container'>
                                <input className='form-control' type="text" id="formGroupInputSmall"
                                           placeholder="Small input" />
                            </td>
                            <td>
                                <div className={[st.testDiv, 'form-control'].join(' ')} contentEditable={true}>test</div>
                            </td>
                            <td>test</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>2</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>2</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

BTable.propTypes = {}

export default BTable