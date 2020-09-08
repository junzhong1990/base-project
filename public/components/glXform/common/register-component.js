import xLabel from '../components/label'
import xNumber from '../components/number.vue'
import searchTips from '../components/search-tips.vue'
import Render from './render'

export default {
  components: {
    xNumber,
    xLabel,
    searchTips,
    Render
  },
  methods: {
    getComponent ({type = 'input', componentName}) {
      return componentName || (type === 'number' ? 'x-number' : `el-${type}`)
    }
  }
}
