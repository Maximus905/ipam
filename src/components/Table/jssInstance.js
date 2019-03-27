import {create} from 'jss'
import preset from 'jss-preset-default'

// const jss = create({plugins: [camelCase(), vendorPrefixer(), defaultUnit(), jssNested()]})
const jss = create(preset())
export default jss