<template>
  <CommonTable
    :statusList="statusList"
    :useStatus="true"
    :disableStatusBtns="true"
    :disableAddBtn="true"
    :disableDelete="true"
    :columns="columns"
    :loading="loading"
    initSortProperty="updateTime"
    initSortOrder="DESC"
    editPageName="MerchantVerificationEdit"
    :filteredPageNames="['MerchantVerificationEdit']"
    :listHandler="listHandler"
    @setLoading="setLoading"
    @setGoEdit="setGoEdit"
  >
  </CommonTable>
</template>
<script>
  import API from '@/api/merchant-verification'
  import {Message} from 'iview'
  import CommonTable from '@/components/tables/common-table'

  export default {
    name: 'MerchantVerificationList',
    components: {
      CommonTable
    },
    data() {
      return {
        statusList: [
          {
            value: 'Checking',
            label: '未审核'
          },
          {
            value: 'Passed',
            label: '已通过'
          },
          {
            value: 'UnPassed',
            label: '未通过'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        loading: false,
        columns: [
          {title: '用户名', key: 'username', sortable: true},
          {title: '商家名称', key: 'name', sortable: true},
          {
            title: '审核状态',
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.status.text)
            }
          },
          {title: '失败原因', key: 'reason'},
          {title: '修改时间', key: 'updateTime', sortable: true, sortType: 'desc'},
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
                  on: {
                    'click': () => {
                      this.goEdit(params.row.id)
                    }
                  }
                }, '查看')
              ])
            }
          }
        ]
      }
    },
    methods: {
      listHandler: API.list,
      setLoading(loading) {
        this.loading = loading
      },
      setGoEdit(callback) {
        this.goEdit = callback
      }
    },
  }
</script>
