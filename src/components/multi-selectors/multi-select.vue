<style lang="less">
  .selected {
    background-color: #2d8cf0;
    color: white;
  }
</style>

<template>
  <div class="float-left">
    <Input placeholder="快速搜索" v-model="searchText" clearable @on-change="search"/>
    <ul class="outline-border"
        style="list-style: none; padding: 10px; height: 300px; scroll: auto;">
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
      'isLeft',
      'leftList',
      'rightList',
      'originLeftList',
      'originRightList'
    ],
    components: {},
    data() {
      return {
        searchText: ''
      }
    },
    computed: {
      filteredList() {
        let arr = null
        if (this.isLeft) {
          if (this.rightList && this.rightList.length > 0) {
            arr = []
            for (let j in this.leftList) {
              let found = false
              let item = this.leftList[j]
              for (let i in this.rightList) {
                let filterItem = this.rightList[i]
                if (item.key === filterItem.key) {
                  found = true
                  break
                }
              }
              if (!found) {
                arr.push(item)
              }
            }
          } else {
            arr = this.leftList
          }
        } else {
          arr = this.rightList
        }
        return arr
      }
    },
    methods: {
      triggerItem(item, index) {
        item.selected = !item.selected
        if(item.selected) {
          this.$refs.item[index].className = 'selected';
        } else {
          this.$refs.item[index].className = '';
        }
      },
      search() {
        if (this.searchText) {
          if (this.isLeft) {
            let arr = []
            for (let i in this.originLeftList) {
              let item = this.originLeftList[i]
              if (item.text.indexOf(this.searchText) > -1) {
                arr.push(item)
              }
            }
            this.$emit('setLists', arr, this.rightList)
          } else {
            let arr = []
            for (let i in this.originRightList) {
              let item = this.originRightList[i]
              if (item.text.indexOf(this.searchText) > -1) {
                arr.push(item)
              }
            }
            this.$emit('setLists', this.leftList, arr)
          }
        } else {
          if (this.isLeft) {
            this.$emit('setLists', this.originLeftList, this.rightList)
          } else {
            this.$emit('setLists', this.leftList, this.originRightList)
          }
        }
      }
    }
  }
</script>
