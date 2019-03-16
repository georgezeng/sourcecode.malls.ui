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
            {{ item.username }}
          </li>
        </ul>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="loading" @click="bulkDelete">删除</Button>
      </div>
    </Modal>

    <Card>
      <Input v-model="searchText" search enter-button @on-search="load"
             style="float: left; width: 200px; margin-bottom: 5px;"/>
      <Button @click="bulkDeleteModal=true" :disabled="deleteBtnDisabled" class="float-right" type="error">批量删除</Button>
      <Button @click="toAddView" class="float-right margin-right" type="primary">新增</Button>
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
  import API from '@/api/users'
  import {Message} from 'iview'

  export default {
    name: 'UserList',
    components: {},
    data() {
      let self = this
      return {
        queryInfo: {
          page: {
            num: 1,
            size: 10,
            property: 'username',
            order: 'ASC'
          }
        },
        searchText: '',
        total: 0,
        list: [],
        selection: [],
        loading: false,
        bulkDeleteModal: false,
        deleteBtnDisabled: true,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '用户名', key: 'username', sortable: true, sortType: 'asc'},
          {title: '邮箱', key: 'email', sortable: true},
          {title: '手机号', key: 'mobile', sortable: true},
          {
            title: '状态',
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.enabled ? '使用中' : '禁用中')
            }
          },
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
                      self.toEditView(params.row.id)
                    }
                  }
                }, '编辑'),

                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '你确定要' + (params.row.enabled ? '禁用' : '启用') + '吗?'
                  },
                  on: {
                    'on-ok': () => {
                      this.triggerStatus(params.row)
                    }
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, [
                  h('Button', {
                    props: {
                      type: params.row.enabled ? 'warning' : 'success',
                      size: 'small'
                    }
                  }, params.row.enabled ? '禁用' : '启用')
                ]),

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
      load() {
        this.queryInfo.data = this.searchText
        this.queryInfo.page.num = 1
        this.changePage()
      },
      sortChange({key, order}) {
        if (!order) order = 'ASC'
        this.queryInfo.page.property = key
        this.queryInfo.page.order = order.toUpperCase()
        this.load()
      },
      changePage(pageNum) {
        this.loading = true
        this.queryInfo.page.num = pageNum ? pageNum : this.queryInfo.page.num
        API.list(this.queryInfo).then(res => {
          this.list = res.list
          this.total = res.total
          this.loading = false
        }).catch(ex => {
          this.loading = false
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
      enableDeleteBtn(selection) {
        this.deleteBtnDisabled = false
        this.recollectIds(selection)
      },
      disableDeleteBtn(selection) {
        this.deleteBtnDisabled = selection.length == 0
        this.recollectIds(selection)
      },
      recollectIds(selection) {
        if (selection) {
          this.selection = selection
        }
      },
      toAddView() {
        this.toEditView(0)
      },
      toEditView(id) {
        this.$router.push({
          name: 'UserEdit',
          params: {
            id
          }
        })
      },
      triggerStatus(item) {
        this.loading = true
        let action = item.enabled ? '禁用' : '启用'
        let data = {
          ...item,
          enabled: !item.enabled
        }
        API.save(data).then(res => {
          this.loading = false
          Message.success(action + '成功')
          this.load()
        }).catch(ex => {
          this.loading = false
        })
      }
    },
    mounted: function () {
      this.load()
    }
  }
</script>
