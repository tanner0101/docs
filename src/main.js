import Vue from 'vue'
import Root from '@/root.vue'
import PageMenu from '@/components/page-menu.vue'
import PageMenuItem from '@/components/page-menu-item.vue'
import PageView from '@/components/page-view.vue'

Vue.component('page-menu', PageMenu)
Vue.component('page-menu-item', PageMenuItem)
Vue.component('page-view', PageView)

Vue.config.productionTip = false

new Vue({
  render: h => h(Root),
}).$mount('#app')
