<template>
  <div>
    <Modal v-model="bulkDeleteModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>操作提示</span>
      </p>
      <div>
        <p>确定要删除选中的记录吗?</p>
        <ul style="list-style: none;">
          <li v-for="item in selection">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="loading" @click="bulkDelete">删除</Button>
      </div>
    </Modal>

    <Card>
      <Input v-model="queryInfo.data" search enter-button @on-search="load"
             style="float: left; width: 200px; margin-bottom: 5px;"/>
      <Button @click="bulkDeleteModal=true" :disabled="deleteBtnDisabled" class="float-right" type="error">批量删除</Button>
      <Button @click="goAdd" class="float-right margin-right" type="primary">新增</Button>
      <div class="clearfix"></div>
      <Table class="margin-top-bottom" :loading="loading" :data="list" :columns="columns"
             @on-select-all="enableDeleteBtn"
             @on-select="enableDeleteBtn" @on-sort-change="sortChange"
             @on-select-all-cancel="disableDeleteBtn" @on-select-cancel="disableDeleteBtn"/>
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
  import API from '@/api/role'
  import { Message } from 'iview'

  export default {
    name: 'RoleList',
    components: {},
    data () {
      let self = this
      return {
        queryInfo: {
          data: '',
          page: {
            num: 1,
            size: 10,
            property: 'name',
            order: 'ASC'
          }
        },
        total: 0,
        list: [],
        selection: [],
        loading: false,
        bulkDeleteModal: false,
        deleteBtnDisabled: true,
        columns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: '编码', key: 'code', sortable: true, sortType: 'asc' },
          { title: '角色名', key: 'name', sortable: true },
          { title: '描述', key: 'description' },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      self.goEdit(params.row.id)
                    }
                  }
                }, '编辑'),

                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '你确定要删除吗?'
                  },
                  on: {
                    'on-ok': () => {
                      this.deleteData([params.row])
                    }
                  }
                }, [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    }
                  }, '删除')
                ])
              ])
            }
          }
        ]
      }
    },
    methods: {
      load () {
        this.changePage(1)
      },
      sortChange ({ key, order }) {
        if (!order) order = 'ASC'
        this.queryInfo.page.property = key
        this.queryInfo.page.order = order.toUpperCase()
        this.load()
      },
      changePage(pageNum) {
        this.loading = true
        this.queryInfo.page.num = pageNum ? pageNum : this.queryInfo.page.num
        API.list(this.queryInfo).then(res => {
          if (res.list) {
            this.list = res.list
            this.total = res.total
          } else {
            this.list = []
            this.total = 0
          }
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
      changePageSize(pageSize) {
        this.queryInfo.page.size = pageSize ? pageSize : this.queryInfo.page.size
        this.changePage(1)
      },
      bulkDelete () {
        this.deleteData(this.selection)
      },
      deleteData (selection) {
        this.loading = true
        let ids = []
        selection.forEach(item => {
          ids.push(item.id)
        })
        API.delete(ids).then(res => {
          this.bulkDeleteModal = false
          Message.success('删除成功')
          this.load()
        }).catch(ex => {
          this.bulkDeleteModal = false
          this.loading = false
        })
      },
      enableDeleteBtn (selection) {
        this.deleteBtnDisabled = false
        this.recollectIds(selection)
      },
      disableDeleteBtn (selection) {
        this.deleteBtnDisabled = selection.length == 0
        this.recollectIds(selection)
      },
      recollectIds (selection) {
        if (selection) {
          this.selection = selection
        }
      },
      goAdd () {
        this.goEdit(0)
      },
      goEdit (id) {
        this.$store.commit('setQueryInfo', this.queryInfo)
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'RoleEdit',
          params: {
            id
          }
        })
      }
    },
    mounted: function () {
      let res = this.$store.state.app.tagNavList.filter(item => item.name !== 'RoleEdit')
      this.$store.commit('setTagNavList', res)
      this.load()
    },
    updated: function() {
      let queryInfo = this.$store.state.app.queryInfo
      if (queryInfo) {
        this.$store.commit('setQueryInfo', null)
        this.queryInfo = queryInfo
        this.changePage()
      }
    }
  }
</script>
