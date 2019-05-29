<template>
  <CommonTable
    :columns="columns"
    :loading="loading"
    initSortProperty="name"
    deleteItemName="name"
    editPageName="RoleEdit"
    :filteredPageNames="['RoleEdit']"
    :listHandler="listHandler"
    :deleteHandler="deleteHandler"
    @setLoading="setLoading"
    @setGoEdit="setGoEdit"
    @setDeleteData="setDeleteData"
  >
  </CommonTable>
</template>

<script>
  import API from '@/api/role'
  import { Message } from 'iview'
  import CommonTable from '@/components/tables/common-table'

  export default {
    name: 'RoleList',
    components: {
      CommonTable
    },
    data () {
      return {
        loading: false,
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
                      this.goEdit(params.row.id)
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
      listHandler: API.list,
      deleteHandler: API.delete,
      setLoading(loading) {
        this.loading = loading
      },
      setDeleteData(callback) {
        this.deleteData = callback
      },
      setGoEdit(callback) {
        this.goEdit = callback
      }
    }
  }
</script>
