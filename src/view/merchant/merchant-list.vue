<template>
  <div>
    <Modal v-model="bulkStatusModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>操作提示</span>
      </p>
      <div>
        <p>确定要{{toEnable ? '启用' : '禁用'}}选中的记录吗?</p>
        <ul style="list-style: none;">
          <li v-for="item in selection">
            {{ item.username }}
          </li>
        </ul>
      </div>
      <div slot="footer" :style="{display: toEnable ? 'none' : 'block'}" >
        <Button type="error" size="large" long :loading="loading" @click="bulkDisable">禁用</Button>
      </div>
      <div slot="footer" :style="{display: toEnable ? 'block' : 'none'}" >
        <Button type="success" size="large" long :loading="loading" @click="bulkEnable">启用</Button>
      </div>
    </Modal>

    <Card>
      <Input v-model="queryInfo.data.searchText" class="margin-right" search enter-button @on-search="load"
             style="float: left; width: 200px; margin-bottom: 5px;"/>
      <Select @on-change="load" style="width: 100px" v-model="queryInfo.data.status">
        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{item.label}}</Option>
      </Select>
      <Button @click="bulkStatusModal=true;toEnable=false;" :disabled="disableBtnDisabled" class="float-right" type="error">批量禁用</Button>
      <Button @click="bulkStatusModal=true;toEnable=true;" :disabled="enableBtnDisabled" class="float-right margin-right" type="success">批量启用</Button>
      <div class="clearfix"></div>
      <Table class="margin-top-bottom" :loading="loading" :data="list" :columns="columns"
             @on-select-all="enableStatusBtn"
             @on-select="enableStatusBtn" @on-sort-change="sortChange"
             @on-select-all-cancel="disableStatusBtn" @on-select-cancel="disableStatusBtn"/>
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
  import API from '@/api/merchant'
  import {Message} from 'iview'

  export default {
    name: 'UserList',
    components: {},
    data() {
      let self = this
      return {
        statusList: [
          {
            value: 'true',
            label: '使用中'
          },
          {
            value: 'false',
            label: '禁用中'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        queryInfo: {
          data: {
            status: 'true',
            searchText: ''
          },
          page: {
            num: 1,
            size: 10,
            property: 'createTime',
            order: 'DESC'
          }
        },
        total: 0,
        list: [],
        selection: [],
        loading: false,
        toEnable: false,
        bulkStatusModal: false,
        enableBtnDisabled: true,
        disableBtnDisabled: true,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '用户名', key: 'username', sortable: true},
          {title: '邮箱', key: 'email', sortable: true},
          {
            title: '状态',
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.enabled ? '使用中' : '禁用中')
            }
          },
          {title: '创建时间', key: 'createTime', sortable: true, sortType: 'desc'},
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              return h('div', [
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

              ])
            }
          }
        ]
      }
    },
    methods: {
      load() {
        this.disableBtnDisabled = true
        this.enableBtnDisabled = true
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
      bulkDisable() {
        this.loading = true
        let ids = []
        this.selection.forEach(item => {
          ids.push(item.id)
        })
        API.disable(ids).then(res => {
          this.bulkStatusModal = false
          Message.success('禁用成功')
          this.load()
        }).catch(ex => {
          this.bulkStatusModal = false
          this.loading = false
        })
      },
      bulkEnable() {
        this.loading = true
        let ids = []
        this.selection.forEach(item => {
          ids.push(item.id)
        })
        API.enable(ids).then(res => {
          this.bulkStatusModal = false
          Message.success('启用成功')
          this.load()
        }).catch(ex => {
          this.bulkStatusModal = false
          this.loading = false
        })
      },
      enableStatusBtn(selection) {
        if (this.queryInfo.data.status === 'true') {
          this.disableBtnDisabled = false
          this.enableBtnDisabled = true
        } else if (this.queryInfo.data.status === 'false') {
          this.disableBtnDisabled = true
          this.enableBtnDisabled = false
        } else {
          this.disableBtnDisabled = false
          this.enableBtnDisabled = false
        }
        this.recollectIds(selection)
      },
      disableStatusBtn(selection) {
        let noRecord = selection.length == 0
        if (this.queryInfo.data.status === 'true') {
          this.disableBtnDisabled = true
          this.enableBtnDisabled = noRecord
        } else if (this.queryInfo.data.status === 'false') {
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
      goEdit(id) {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantEdit',
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
