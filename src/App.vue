<template lang="pug">
  .app
    .nav
      ul
        li(v-for="page in pages") 
          a(v-if="!page.children" @click="visit(page, $event)" href="#") {{ page.title }}
          span(v-if="page.children") {{ page.title }}
          ul(v-if="page.children")
            li(v-for="child in page.children") 
              a(@click="visit(child, $event)" href="#") {{ child.title }}
    .view(v-if="page" v-html="page.html")
</template>

<script>
import Axios from 'axios'
import JSYaml from 'js-yaml'
import Remarkable from 'remarkable'
import HighlightJS from 'highlight.js'

export default {
  name: 'app',
  async mounted() {
    var res = await Axios.get('https://raw.githubusercontent.com/tanner0101/docs-en/master/manifest.yml')
    var manifest = JSYaml.load(res.data)
    console.log(manifest)
    this.manifest = manifest
    await this.visit(this.pages[0], null)
  },
  methods: {
    async visit(page, event) {
      if (event) {
        event.preventDefault()
      }
      var res = await Axios.get('https://raw.githubusercontent.com/tanner0101/docs-en/master/' + page.path)
      var md = new Remarkable({
        html: true,
        highlight: (string, language) => { 
          if (language && HighlightJS.getLanguage(language)) {
            return HighlightJS.highlight(language, string).value
          }
          return HighlightJS.highlightAuto(string).value
        }
      })
      page.html = md.render(res.data)
      this.page = page
    }
  },
  computed: {
    sources() {
      // TODO: support locales and versions
      return [
        'https://raw.githubusercontent.com/tanner0101/docs-en/master/'
      ]
    },
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
    }
  },
  data() {
    return {
      manifest: null,
      page: null
    }
  }
}
</script>

<style lang="sass">
.app
  height: 100%
  position: relative
  font-family: 'Roboto', sans-serif;
  a
    color: #43C4FC
    text-decoration: none
  .nav
    padding: 16px 0
    position: absolute
    top: 0
    left: 0
    bottom: 0
    overflow-y: auto
    width: 224px
    z-index: 1
    ul
      list-style-type: none
      margin: 0
      padding-left: 16px
      li
        line-height: 24px
  .view
    position: absolute
    top: 0
    left: 224px
    right: 0
    bottom: 0
    padding: 0 16px
    overflow-y: auto
    z-index: 0
    font-size: 18px
    p, li
      line-height: 32px
    img
      max-width: 100%
  pre
    padding: 16px
    border-radius: 8px
    background: #292A30
    color: #F4F5F5
    overflow-x: auto
    code
      font-size: 14px
  code
    font-size: 16px
    font-family: 'Roboto Mono', monospace;
  .hljs-comment
    color: #788590
  .hljs-type
    color: #9CD474
  .hljs-keyword
    color: #FB78B0
  .hljs-string
    color: #FA7E6E
  .hljs-number
    color: #A79DF7
  .hljs-built_in
    color: #A7EBDD
</style>
