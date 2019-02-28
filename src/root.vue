<template lang="pug">
  .app
    page-menu(
      class="menu"
      :pages="pages"
      :currentPage="currentPage"
      @choose="choosePage"
    )
    transition(name="slide-up")
      page-view(
        class="view"
        v-if="currentPageData"
        :currentPage="currentPageData"
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
      this.currentPageData = null
      this.currentPage = page
      history.pushState(null, null, page.path)
      if (page.parentTitle) {
        document.title = `Docs → ${page.parentTitle} → ${page.title}`
      } else {
        document.title = `Docs → ${page.title}`
      }
      var res = await Axios.get(this.currentSource.rootURL + this.currentVersion + page.path + '.md')
      this.currentPageData = res.data
    },
    async chooseSource(source, version = null) {
      if (!version) {
        version = source.versions[0]
      }
      this.currentSource = source
      this.currentVersion = version
      var res = await Axios.get(source.rootURL + '/' + version + '/' + 'manifest.yml?1')
      var manifest = JSYaml.load(res.data)
      this.manifest = manifest
      var page = null
      if (window.location.pathname) {
        var found = this.findPageWithPath(window.location.pathname)
        if (!found) {
          page = this.pages[0]
        } else {
          page = found
        }
      } else {
        page = this.pages[0]
      }
      await this.choosePage(page)
    },
    async link(a) {
      if (a.hostname != 'localhost') {
        window.location.href = a.href
      } else {
        var path = a.pathname
        if (path.endsWith('.md')) {
          path = path.split('.md').slice(0, -1).join()
        }
        let page = this.findPageWithPath(path)
        if (!page) {
          throw new Error('No page found for link: ' + a)
        }
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

      function parsePage(page, parent) {
        var key = Object.keys(page)[0]
        var item = page[key]
        var data = {
          title: key,
          path: item
        }
        if (parent) {
          data.parentTitle = parent.title
        }
        if(Array.isArray(item)) {
          data.children = item.map(page => parsePage(page, data))
        }
        return data
      }

      return this.manifest.nav.map(page => parsePage(page, null))
    },
  },
  data() {
    return {
      manifest: null,
      currentSource: null,
      currentVersion: null,
      currentPage: null,
      currentPageData: null
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.appear-up-enter-active, .appear-up-leave-active
  transition: opacity $animation-duration $animation-ease, transform $animation-duration $animation-ease
.appear-up-enter, .appear-up-leave-to
  opacity: 0
  transform: scale(0.9)

.appear-down-enter-active, .appear-down-leave-active
  transition: opacity $animation-duration $animation-ease, transform $animation-duration $animation-ease
.appear-down-enter, .appear-down-leave-to
  opacity: 0
  transform: scale(1.1)

.slide-up-enter-active, .slide-up-leave-active
  transition: opacity $animation-duration $animation-ease, transform $animation-duration $animation-ease
.slide-up-enter, .slide-up-leave-to
  opacity: 0
  transform: translate(0, 32px)

.app
  height: 100%
  position: relative
  overflow: hidden
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
