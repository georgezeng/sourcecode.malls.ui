<style lang="less">
  .multi-input {
    width: 200px;
  }
</style>

<template>
  <div>
    <MultiSelect :leftList="leftList" :rightList="rightList" :originLeftList="originLeftList"
                 :originRightList="originRightList" :isLeft="true" @setLists="setLists"
                 class="multi-input"/>
    <div class="float-left" style="margin: 50px;">
      <Button style="display: block; margin-bottom: 10px;" @click="addItems">
        <Icon type="ios-arrow-forward"/>
      </Button>
      <Button style="display: block;" @click="removeItems">
        <Icon type="ios-arrow-back"/>
      </Button>
    </div>
    <MultiSelect :leftList="leftList" :rightList="rightList" :originLeftList="originLeftList"
                 :originRightList="originRightList" :isLeft="false" @setLists="setLists"
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
        for (let i in this.leftList) {
          let item = this.leftList[i]
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
        let leftArr = this.leftList.concat()
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
      setLists(leftArr, rightArr) {
        this.$emit('set-multi-selectors-data', leftArr, rightArr, false)
      }
    }
  }
</script>
