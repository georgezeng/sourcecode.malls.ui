<template>
  <div>
    <Card>
      <Input v-model="queryInfo.data.searchText" class="margin-right" search enter-button @on-search="load"
             style="float: left; width: 200px; margin-bottom: 5px;"/>
      <Select @on-change="load" style="width: 100px" v-model="queryInfo.data.statusText">
        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{item.text}}</Option>
      </Select>
      <Table class="margin-top-bottom" :loading="loading" :data="list" :columns="columns"
             @on-sort-change="sortChange"/>
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
  import API from '@/api/merchant-verification'
  import {Message} from 'iview'

  export default {
    name: 'MerchantVerificationList',
    components: {},
    data() {
      let self = this
      return {
        statusList: [
          {
            value: 'Checking',
            text: '未审核'
          },
          {
            value: 'Passed',
            text: '已通过'
          },
          {
            value: 'UnPassed',
            text: '未通过'
          },
          {
            value: 'all',
            text: '全部'
          }
        ],
        queryInfo: {
          data: {
            statusText: 'Checking',
            searchText: ''
          },
          page: {
            num: 1,
            size: 10,
            property: 'updateTime',
            order: 'DESC'
          }
        },
        total: 0,
        list: [],
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
      load() {
        this.changePage(1)
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
      goEdit(id) {
        this.$store.commit('setQueryInfo', this.queryInfo)
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantVerificationEdit',
          params: {
            id,
            queryInfo: this.queryInfo
          }
        })
      },
    },
    mounted: function () {
      let res = this.$store.state.app.tagNavList.filter(item => item.name !== 'MerchantVerificationEdit')
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
