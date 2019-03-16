<style lang="less">
  .selected {
    background-color: #2d8cf0;
    color: white;
  }
</style>

<template>
  <div class="float-left">
    <Input placeholder="快速搜索" v-model="searchText" clearable />
    <ul class="outline-border"
        style="list-style: none; padding: 10px; height: 300px; overflow: auto;">
      <li ref="item" v-for="(item, index) in filteredList" :key="item.key" style="cursor: pointer; padding: 0 5px;"
          @click="triggerItem(item, index)">
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'MultiSelect',
    props: [
      'list',
      'originList',
      'isLeft'
    ],
    components: {},
    data() {
      return {
        searchText: ''
      }
    },
    computed: {
      filteredList: {
        get() {
          return this.list
        },
        set(text) {
          let arr = []
          if (text) {
            for (let i in this.originList) {
              let item = this.originList[i]
              if (item.text.indexOf(text) > -1) {
                arr.push(item)
              }
            }
          } else {
            arr = this.originList
          }
          this.$emit('setList', arr, this.isLeft)
        }
      }
    },
    watch: {
      searchText(text) {
        this.filteredList = text;
      }
    },
    methods: {
      triggerItem(item, index) {
        item.selected = !item.selected
        if (item.selected) {
          this.$refs.item[index].className = 'selected'
        } else {
          this.$refs.item[index].className = ''
        }
      }
    }
  }
</script>
