<template lang="pug">
  .page-view(ref="container")
    div(v-if="currentPage" ref="html" v-html="currentPageHTML")
</template>

<script>
import Remarkable from 'remarkable'
import HighlightJS from 'highlight.js'

export default {
  name: 'page-view',
  props: ['currentPage'],
  computed: {
    currentPageHTML() {
      if (!this.currentPage) {
        return null
      }
      var md = new Remarkable({
        html: true,
        highlight: (string, language) => { 
          if (language && HighlightJS.getLanguage(language)) {
            return HighlightJS.highlight(language, string).value
          }
          return HighlightJS.highlightAuto(string).value
        }
      })
      return md.render(this.currentPage)
    },
  },
  watch: {
    currentPage() {
      this.$refs.container.scrollTop = 0
    }
  },
  updated() {
    var elements = this.$refs.html.getElementsByTagName('a')
    for (let a of elements) {
      a.onclick = (event) => {
        event.preventDefault()
        this.$emit('link', a)
      }
    }
  }
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.page-view    
  font-size: 18px
  a
    color: $color-primary
    text-decoration: none
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
