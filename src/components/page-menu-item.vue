<template lang="pug">
  li.page-menu-item(:class="{ open: open }")
    a(
      v-if="!page.children" 
      @click="choose(page, $event)"
      href="#"
      :class="{ active: currentPage && page.path == currentPage.path }"
    ) {{ page.title }}
    span(v-if="page.children" @click="open = !open") {{ page.title }}
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
  name: 'page-menu-item',
  props: ['page', 'currentPage'],
  methods: {
    choose(page, event) {
      event.preventDefault()
      this.$emit('choose', page)
    }
  },
  data() {
    return {
      open: false
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.page-menu-item
  ul 
    list-style-type: none
    padding-left: 16px
    height: 0
    overflow: hidden
  a, span
    line-height: 32px
  span
    cursor: pointer
    position: relative
    &:hover
      color: $color-accent
  a
    color: black
    text-decoration: none
    &:hover
      color: $color-accent
    &.active
      color: $color-primary
  &.open
    ul
      height: auto
</style>
