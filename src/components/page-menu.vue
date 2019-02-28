<template lang="pug">
  nav.page-menu      
    ul
      page-menu-item(
        v-for="page in pages" 
        :page="page" 
        :currentPage="currentPage" 
        @choose="$emit('choose', $event)"
      )
</template>

<script>
export default {
  name: 'page-menu',
  props: ['pages', 'currentPage']
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
</style>
