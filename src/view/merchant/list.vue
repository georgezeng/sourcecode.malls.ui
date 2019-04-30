<template>
  <CommonTable
    enableStatusText="启用"
    disableStatusText="禁用"
    :statusList="statusList"
    statusItemName="username"
    :updateStatusHandler="updateStatusHandler"
    @setTriggerStatus="setTriggerStatus"
    :useStatus="true"
    :disableAddBtn="true"
    :disableDelete="true"
    :columns="columns"
    :loading="loading"
    initSortProperty="createTime"
    initSortOrder="DESC"
    editPageName="MerchantEdit"
    :filteredPageNames="['MerchantEdit']"
    :listHandler="listHandler"
    @setLoading="setLoading"
    @setGoEdit="setGoEdit"
  >
  </CommonTable>
</template>
<script>
  import API from '@/api/merchant'
  import {Message} from 'iview'
  import CommonTable from '@/components/tables/common-table'

  export default {
    name: 'UserList',
    components: {
      CommonTable
    },
    data() {
      return {
        statusList: [
          {
            value: 'true',
            label: '启用中'
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
        loading: false,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '用户名', key: 'username', sortable: true},
          {title: '邮箱', key: 'email', sortable: true},
          {
            title: '状态',
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.enabled ? '启用中' : '禁用中')
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
      listHandler: API.list,
      updateStatusHandler: API.updateStatus,
      setLoading(loading) {
        this.loading = loading
      },
      setTriggerStatus(callback) {
        this.triggerStatus = callback
      },
      setGoEdit(callback) {
        this.goEdit = callback
      }
    },
  }
</script>
