<template lang="pug">
  .app
    page-menu(
      class="menu"
      :pages="pages"
      :currentPage="currentPage"
      @choose="choosePage"
    )
    page-view(
      class="view"
      :currentPage="currentPage"
      @link="link"
    )
</template>

<script>
import Axios from 'axios'
import JSYaml from 'js-yaml'
import Config from './config'

export default {
  name: 'app',
  async mounted() {
    await this.chooseSource(Config.sources[0])
  },
  methods: {
    async choosePage(page) {
      var res = await Axios.get(this.currentSource.rootURL + '/' + this.currentVersion + '/' + page.path)
      page.data = res.data
      this.currentPage = page
      history.pushState(null, null, '/' + page.path)
    },
    async chooseSource(source, version = null) {
      if (!version) {
        version = source.versions[0]
      }
      this.currentSource = source
      this.currentVersion = version
      var res = await Axios.get(source.rootURL + '/' + version + '/' + 'manifest.yml')
      var manifest = JSYaml.load(res.data)
      this.manifest = manifest
      var page = null
      if (window.location.pathname) {
        page = this.findPageWithPath(window.location.pathname.substr(1))
      } else {
        page = this.pages[0]
      }
      await this.choosePage(page)
    },
    async link(a) {
      if (a.hostname != 'localhost') {
        window.location.href = a.href
      } else {
        let page = this.findPageWithPath(a.pathname.substr(1))
        await this.choosePage(page)
      }
    },
    findPageWithPath(path) {
      var found = null
      this.pages.forEach(page => {
        if (page.path == path) {
          found = page
        }
        if (page.children) {
          page.children.forEach(child => {
            if (child.path == path) {
              found = child
            }
          })
        }
      })
      return found
    }
  },
  computed: {
    pages() {
      if (!this.manifest) {
        return []
      }

      function parsePage(page) {
        var key = Object.keys(page)[0]
        var item = page[key]
        var data = {
          title: key,
          path: item
        }
        if(Array.isArray(item)) {
          data.children = item.map(page => parsePage(page))
        }
        return data
      }

      return this.manifest.nav.map(page => parsePage(page))
    },
  },
  data() {
    return {
      manifest: null,
      currentSource: null,
      currentVersion: null,
      currentPage: null
    }
  }
}
</script>

<style scoped lang="sass">
.app
  height: 100%
  position: relative
  .menu
    position: absolute
    top: 0
    left: 0
    bottom: 0
    width: 224px
    overflow-y: auto
    z-index: 1
  .view
    position: absolute
    top: 0
    left: 224px
    right: 0
    bottom: 0
    padding: 0 16px
    overflow-y: auto
    z-index: 0
</style>
