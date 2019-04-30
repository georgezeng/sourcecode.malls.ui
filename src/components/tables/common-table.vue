<template>
  <div>
    <Modal v-if="!disableDelete" v-model="bulkDeleteModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>操作提示</span>
      </p>
      <div>
        <p>确定要删除选中的记录吗?</p>
        <ul style="list-style: none;">
          <li v-for="item in selection">
            {{ item[deleteItemName] }}
          </li>
        </ul>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="loading" @click="bulkDelete">删除</Button>
      </div>
    </Modal>

    <Modal v-if="useStatus" v-model="bulkStatusModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>操作提示</span>
      </p>
      <div>
        <p>确定要{{toEnable ? enableStatusText : disableStatusText}}选中的记录吗?</p>
        <ul style="list-style: none;">
          <li v-for="item in selection">
            {{ item[statusItemName] }}
          </li>
        </ul>
      </div>
      <div slot="footer" v-if="!toEnable">
        <Button type="error" size="large" long :loading="loading" @click="bulkDisableStatus">{{disableStatusText}}
        </Button>
      </div>
      <div slot="footer" v-else>
        <Button type="success" size="large" long :loading="loading" @click="bulkEnableStatus">{{enableStatusText}}
        </Button>
      </div>
    </Modal>

    <Card>
      <Input v-model="queryInfo.data.searchText" search enter-button @on-search="load"
             style="float: left; width: 200px; margin-bottom: 5px;"/>
      <Select v-if="useStatus" @on-change="load" style="width: 100px; margin-left: 5px;"
              v-model="queryInfo.data.statusText">
        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{item.label}}</Option>
      </Select>
      <slot></slot>
      <Button v-if="showBackBtn" class="float-right margin-left" @click="goParentList" type="success">返回</Button>
      <Button v-if="showStatusBtns" @click="bulkStatusModal=true;toEnable=false;" :disabled="disableBtnDisabled"
              class="float-right" type="error">
        批量{{disableStatusText}}
      </Button>
      <Button v-if="showStatusBtns" @click="bulkStatusModal=true;toEnable=true;" :disabled="enableBtnDisabled"
              class="margin-left float-right margin-right" type="success">批量{{enableStatusText}}
      </Button>
      <Button v-if="!disableDelete" @click="bulkDeleteModal=true" :disabled="deleteBtnDisabled" class="float-right"
              type="error">批量删除
      </Button>
      <Button v-if="!disableAddBtn" @click="goAdd" class="float-right margin-right" type="primary">新增</Button>
      <div class="clearfix"></div>
      <Table class="margin-top-bottom" :loading="loading" :data="list" :columns="columns"
             @on-select-all="enableBtns"
             @on-select="enableBtns" @on-sort-change="sortChange"
             @on-select-all-cancel="disableBtns" @on-select-cancel="disableBtns"/>
      <Page :total="total"
            :page-size="queryInfo.page.size"
            :current="queryInfo.page.num"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            show-elevator show-sizer class="float-right"/>
      <div class="clearfix"></div>
    </Card>
  </div>
</template>
<script>
  import {Message} from 'iview'

  export default {
    name: 'CommonTable',
    components: {},
    props: [
      'listHandler',
      'deleteHandler',
      'updateStatusHandler',
      'statusList',
      'enableStatusText',
      'disableStatusText',
      'status',
      'useStatus',
      'disableDelete',
      'searchText',
      'pageSize',
      'pageNum',
      'order',
      'property',
      'loading',
      'columns',
      'editPageName',
      'filteredPageNames',
      'deleteItemName',
      'initSortProperty',
      'initSortOrder',
      'statusItemName',
      'queryData',
      'parentPageName',
      'subPageName',
      'useParent',
      'disableAddBtn',
      'disableStatusBtns',
    ],
    data() {
      return {
        ids: [],
        queryInfo: {
          data: {
            parent: {
              id: 0
            },
            searchText: '',
            statusText: 'true'
          },
          page: {
            num: 1,
            size: 10,
            property: this.initSortProperty,
            order: this.initSortOrder ? this.initSortOrder : 'ASC'
          }
        },
        total: 0,
        list: [],
        selection: [],
        bulkDeleteModal: false,
        deleteBtnDisabled: true,
        toEnable: false,
        bulkStatusModal: false,
        enableBtnDisabled: true,
        disableBtnDisabled: true,
      }
    },
    computed: {
      showStatusBtns() {
        return this.useStatus && !this.disableStatusBtns
      },
      showBackBtn() {
        return this.useParent && !(this.ids.length == 1 && this.ids[0] == 0)
      }
    },
    methods: {
      goParentList() {
        this.ids.splice(this.ids.length - 1, 1)
        this.$store.commit('setQueryInfo', {queryInfo: null, routeName: this.$router.currentRoute.name})
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: this.parentPageName,
          params: {
            ids: this.ids.join(',')
          }
        })
      },
      setPageList(list) {
        this.list = list
      },
      setLoading(loading) {
        this.$emit('setLoading', loading)
      },
      load() {
        this.$emit('setQueryData', this.queryInfo.data)
        if (this.queryData) {
          this.queryInfo.data = this.queryData
        }
        this.changePage(1)
      },
      sortChange({key, order}) {
        if (!order) order = 'ASC'
        this.queryInfo.page.property = key
        this.queryInfo.page.order = order.toUpperCase()
        this.load()
      },
      changePage(pageNum) {
        this.setLoading(true)
        this.selection = []
        this.disableBtns()
        this.queryInfo.page.num = pageNum ? pageNum : this.queryInfo.page.num
        this.listHandler(this.queryInfo).then(res => {
          if (res.list) {
            this.total = res.total
            this.list = res.list
          } else {
            this.list = res
          }
          this.$emit('setPageResult', res)
          this.setLoading(false)
        }).catch(ex => {
          this.setLoading(false)
        })
      },
      changePageSize(pageSize) {
        this.queryInfo.page.size = pageSize ? pageSize : this.queryInfo.page.size
        this.changePage(1)
      },
      bulkDelete() {
        this.deleteData(this.selection)
      },
      deleteData(selection) {
        this.setLoading(true)
        let ids = []
        selection.forEach(item => {
          ids.push(item.id)
        })
        this.deleteHandler(ids).then(res => {
          this.setLoading(false)
          Message.success('删除成功')
          this.load()
        }).catch(ex => {
          this.setLoading(false)
        })
      },
      enableBtns(selection) {
        this.enableDeleteBtn(selection)
        this.enableStatusBtn(selection)
        this.$emit('enableBtns', selection)
      },
      enableDeleteBtn(selection) {
        this.deleteBtnDisabled = false
        this.recollectIds(selection)
      },
      disableBtns(selection) {
        this.disableDeleteBtn(selection)
        this.disableStatusBtn(selection)
        this.$emit('disableBtns', selection)
      },
      disableDeleteBtn(selection) {
        this.deleteBtnDisabled = !selection || selection.length == 0
        this.recollectIds(selection)
      },
      bulkDisableStatus() {
        this.setLoading(true)
        let ids = []
        this.selection.forEach(item => {
          ids.push(item.id)
        })
        this.updateStatusHandler(ids, false).then(res => {
          this.setLoading(false)
          Message.success(this.disableStatusText + '成功')
          this.load()
        }).catch(ex => {
          this.setLoading(false)
        })
      },
      bulkEnableStatus() {
        this.setLoading(true)
        let ids = []
        this.selection.forEach(item => {
          ids.push(item.id)
        })
        this.updateStatusHandler(ids, false).then(res => {
          this.setLoading(false)
          Message.success(this.enableStatusText + '成功')
          this.load()
        }).catch(ex => {
          this.setLoading(false)
        })
      },
      enableStatusBtn(selection) {
        if (this.queryInfo.data.statusText === 'true') {
          this.disableBtnDisabled = false
          this.enableBtnDisabled = true
        } else if (this.queryInfo.data.statusText === 'false') {
          this.disableBtnDisabled = true
          this.enableBtnDisabled = false
        } else {
          this.disableBtnDisabled = false
          this.enableBtnDisabled = false
        }
        this.recollectIds(selection)
      },
      disableStatusBtn(selection) {
        let noRecord = !selection || selection.length == 0
        if (this.queryInfo.data.statusText === 'true') {
          this.disableBtnDisabled = true
          this.enableBtnDisabled = noRecord
        } else if (this.queryInfo.data.statusText === 'false') {
          this.disableBtnDisabled = noRecord
          this.enableBtnDisabled = true
        } else {
          this.disableBtnDisabled = noRecord
          this.enableBtnDisabled = noRecord
        }
        this.recollectIds(selection)
      },
      recollectIds(selection) {
        if (selection) {
          this.selection = selection
        }
      },
      triggerStatus(item) {
        this.setLoading(true)
        let action = item.enabled ? this.disableStatusText : this.enableStatusText
        let ids = []
        ids.push(item.id)
        this.updateStatusHandler(ids, !item.enabled).then(res => {
          this.setLoading(false)
          Message.success(action + '成功')
          this.load()
        }).catch(ex => {
          this.setLoading(false)
        })
      },
      goAdd() {
        this.goEdit(0)
      },
      goEdit(id) {
        this.ids.push(id)
        this.$store.commit('setQueryInfo', {queryInfo: this.queryInfo, routeName: this.$router.currentRoute.name})
        this.$store.commit('closeTag', this.$router.currentRoute)
        let params = {}
        if (this.ids.length == 1) {
          params.id = this.ids[0]
        } else {
          params.ids = this.ids.join(',')
        }
        this.$router.push({
          name: this.editPageName,
          params
        })
      },
      goSubList(id) {
        this.$store.commit('setQueryInfo', {queryInfo: this.queryInfo, routeName: this.$router.currentRoute.name})
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: this.subPageName,
          params: {
            ids: id
          }
        })
      },
      updateList() {
        if (this.loading) {
          setTimeout(this.updateList, 100)
          return
        }
        let routeName = this.$router.currentRoute.name
        let queryInfo = this.$store.state.app.queryInfo[routeName]
        if (queryInfo) {
          this.$store.commit('setQueryInfo', {queryInfo: null, routeName})
          this.queryInfo = queryInfo
          this.changePage()
        }
      }
    },
    mounted: function () {
      let res = this.$store.state.app.tagNavList.filter(item => {
        for (let i in this.filteredPageNames) {
          if (this.filteredPageNames[i] == item.name) {
            return false
          }
        }
        return true
      })
      this.$store.commit('setTagNavList', res)
      if (this.$router.currentRoute.params.ids) {
        this.ids = (this.$router.currentRoute.params.ids + '').split(',')
        this.queryInfo.data.parent.id = this.ids[this.ids.length - 1]
      }
      this.$emit('setGoEdit', this.goEdit)
      this.$emit('setDeleteData', this.deleteData)
      this.$emit('setTriggerStatus', this.triggerStatus)
      this.$emit('setGoSubList', this.goSubList)
      this.$emit('setPageList', this.setPageList)
      this.load()
    },
    updated: function () {
      setTimeout(this.updateList, 100)
    }
  }
</script>
