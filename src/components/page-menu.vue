<template lang="pug">
  nav.page-menu      
    ul
      li(v-for="page in pages") 
        a(
          v-if="!page.children" 
          @click="choose(page, $event)"
          href="#"
          :class="{ active: currentPage && page.path == currentPage.path }"
        ) {{ page.title }}
        span(v-if="page.children") {{ page.title }}
        ul(v-if="page.children")
          li(v-for="child in page.children") 
            a(
              @click="choose(child, $event)" 
              href="#"
              :class="{ active: currentPage && child.path == currentPage.path }"
            ) {{ child.title }}
</template>

<script>
export default {
  name: 'page-menu',
  props: ['pages', 'currentPage'],
  methods: {
    choose(page, event) {
      event.preventDefault()
      this.$emit('choose', page)
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.page-menu
  padding: 16px 0
  ul
    list-style-type: none
    margin: 0
    padding-left: 16px
    a, span
      line-height: 32px
    span
      font-weight: bold
    a
      color: black
      text-decoration: none
      &:hover
        color: $color-accent
      &.active
        color: $color-primary
</style>
