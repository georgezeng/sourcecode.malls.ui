<style lang="less">
  .multi-input {
    width: 200px;
  }
</style>

<template>
  <div>
    <MultiSelect :list="leftFilterList" :originList="originLeftList" :isLeft="true" @setList="setList" class="multi-input"/>
    <div class="float-left" style="margin: 50px;">
      <Button style="display: block; margin-bottom: 10px;" @click="addItems">
        <Icon type="ios-arrow-forward"/>
      </Button>
      <Button style="display: block;" @click="removeItems">
        <Icon type="ios-arrow-back"/>
      </Button>
    </div>
    <MultiSelect :list="rightList" :originList="originRightList" :isLeft="false" @setList="setList"
                 class="multi-input"/>
  </div>
</template>

<script>
  import MultiSelect from './multi-select'

  export default {
    name: 'MultiSelectors',
    props: [
      'leftList',
      'rightList',
      'originLeftList',
      'originRightList'
    ],
    components: {
      MultiSelect
    },
    data() {
      return {}
    },
    methods: {
      addItems() {
        let leftArr = []
        let rightArr = this.rightList.concat()
        let leftList = this.leftFilterList
        for (let i in leftList) {
          let item = leftList[i]
          if (!item.selected) {
            leftArr.push(item)
          } else {
            let found = false
            for (let j in rightArr) {
              let rightItem = rightArr[j]
              if (rightItem.key == item.key) {
                found = true
                item = rightItem
                break
              }
            }
            if (!found) {
              item.selected = false
              rightArr.push(item)
            }
          }
        }
        this.$emit('set-multi-selectors-data', leftArr, rightArr, true)
      },
      removeItems() {
        let leftArr = this.leftFilterList.concat()
        let rightArr = []
        for (let i in this.rightList) {
          let item = this.rightList[i]
          if (!item.selected) {
            rightArr.push(item)
          } else {
            let found = false
            for (let j in leftArr) {
              let leftItem = leftArr[j]
              if (leftItem.key == item.key) {
                found = true
                item = leftItem
                break
              }
            }
            if (!found) {
              item.selected = false
              leftArr.push(item)
            }
          }
        }
        this.$emit('set-multi-selectors-data', leftArr, rightArr, true)
      },
      setList(list, isLeft) {
        if (isLeft) {
          this.$emit('set-multi-selectors-data', list, this.rightList, false)
        } else {
          this.$emit('set-multi-selectors-data', this.leftFilterList, list, false)
        }
      }
    },
    computed: {
      leftFilterList: {
        get() {
          let arr = [];
          for (let j in this.leftList) {
            let found = false
            let leftItem = this.leftList[j]
            for (let i in this.rightList) {
              let rightItem = this.rightList[i]
              if (leftItem.key === rightItem.key) {
                found = true
                break
              }
            }
            if (!found) {
              arr.push(leftItem)
            }
          }
          return arr;
        }
      }
    }
  }
</script>
