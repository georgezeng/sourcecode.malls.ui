<style lang="less">
  .multi-input {
    width: 200px;
  }
</style>

<template>
  <div>
    <MultiSelect :list="leftFilterList" :originList="originLeftList" :isLeft="true" @setList="setList"
                 class="multi-input"/>
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
        let leftList = this.leftFilterList
        let removeArr = []
        for (let i in leftList) {
          let item = leftList[i]
          if (item.selected) {
            removeArr.push(item)
          }
        }
        let rightArr = this.rightList.concat()
        let leftArr = null
        do {
          leftArr = this.originLeftList
          for (let i in leftArr) {
            if (removeArr[0].key == leftArr[i].key) {
              removeArr.splice(0, 1)
              let item = leftArr.splice(i, 1)[0]
              item.selected = false
              let found = false
              for (let j in rightArr) {
                if (rightArr[j].key == item.key) {
                  found = true
                  break
                }
              }
              if (!found) {
                rightArr.splice(0, 0, item)
              }
              break
            }
          }
        } while (removeArr.length > 0)
        this.$emit('set-multi-selectors-data', leftArr, rightArr, true)
      },
      removeItems() {
        let removeArr = []
        for (let i in this.rightList) {
          let item = this.rightList[i]
          if (item.selected) {
            removeArr.push(item)
          }
        }
        let leftArr = this.leftList.concat()
        let rightArr = null
        do {
          rightArr = this.originRightList
          for (let i in rightArr) {
            if (removeArr[0].key == rightArr[i].key) {
              removeArr.splice(0, 1)
              let item = rightArr.splice(i, 1)[0]
              item.selected = false
              let found = false
              for (let j in leftArr) {
                if (leftArr[j].key == item.key) {
                  found = true
                  break
                }
              }
              if (!found) {
                leftArr.splice(0, 0, item)
              }
              break
            }
          }
        } while (removeArr.length > 0)
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
