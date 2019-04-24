<style>
  .uploadAlert {
    float: left;
    top: 0px;
    left: 140px;
    position: absolute;
  }
</style>
<template>
  <div>
    <Modal
      v-model="deployModal.open"
      :mask-closable="false"
      :title="modalTitle" :closable="false">
      <div :class="{hidden: !deployModal.item.androidType}" style="margin-bottom: 20px; position: relative">
        <Upload :action="androidUrl" with-credentials :show-upload-list="false"
                :format="['apk']"
                :on-format-error="showFormatErrorForAndroid"
                :on-progress="showUploadProgressForAndroid"
                :on-error="showUploadErrorForAndroid"
                :on-success="showUploadSuccessForAndroid">
          <Button :loading="deployModal.androidLoading" icon="logo-android">上传安卓应用</Button>
        </Upload>
        <Alert class="uploadAlert" :class="{hidden: !deployModal.androidUploaded}" type="success">
          上传成功
        </Alert>
        <Alert class="uploadAlert" :class="{hidden: !deployModal.androidErrorText}" type="error">
          {{deployModal.androidErrorText}}
        </Alert>
      </div>
      <div :class="{hidden: !deployModal.item.iosType}" style="position: relative">
        <Upload :action="iosUrl" :show-upload-list="false" with-credentials
                :format="['ipa']"
                :on-format-error="showFormatErrorForIos"
                :on-progress="showUploadProgressForIos"
                :on-error="showUploadErrorForIos"
                :on-success="showUploadSuccessForIos">
          <Button :loading="deployModal.iosLoading" icon="logo-apple">上传苹果应用</Button>
        </Upload>
        <Alert class="uploadAlert" :class="{hidden: !deployModal.iosUploaded}" type="success">
          上传成功
        </Alert>
        <Alert class="uploadAlert" :class="{hidden: !deployModal.iosErrorText}" type="error">
          {{deployModal.iosErrorText}}
        </Alert>
      </div>
      <div slot="footer">
        <Button type="warning" :loading="loading" @click="closeModal">取消</Button>
        <Button type="primary" :loading="loading" @click="deploy">部署</Button>
      </div>
    </Modal>

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
  import API from '@/api/merchant-shop-application'
  import {Message} from 'iview'
  import config from '@/config/index'

  export default {
    name: 'MerchantShopApplicationList',
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
            value: 'UnPay',
            text: '未支付'
          },
          {
            value: 'all',
            text: '全部'
          }
        ],
        deployModal: {
          open: false,
          androidLoading: false,
          androidUploaded: false,
          androidErrorText: '',
          iosLoading: false,
          iosUploaded: false,
          iosErrorText: '',
          item: {
            id: 0,
            name: ''
          }
        },
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
          {title: '店铺名称', key: 'name', sortable: true},
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
                }, '查看'),

                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    disabled: params.row.deployed,
                  },
                  style: {
                    marginLeft: '10px'
                  },
                  on: {
                    'click': () => {
                      if (!params.row.deployed) {
                        this.deployModal.item = params.row
                        this.deployModal.open = true
                      } else {
                        Message.warning('店铺已部署')
                      }
                    }
                  }
                }, '部署')
              ])
            }
          }
        ]
      }
    },
    computed: {
      modalTitle() {
        return '部署[' + this.deployModal.item.name + ']'
      },
      androidUrl() {
        return config.baseUrl + '/merchant/shop/application/upload/params/' + this.deployModal.item.id + '/android'
      },
      iosUrl() {
        return config.baseUrl + '/merchant/shop/application/upload/params/' + this.deployModal.item.id + '/ios'
      }
    },
    methods: {
      showUploadProgressForAndroid() {
        this.loading = true
        this.deployModal.androidLoading = true
      },
      showUploadProgressForIos() {
        this.loading = true
        this.deployModal.iosLoading = true
      },
      showUploadErrorForAndroid(error) {
        this.loading = false
        this.deployModal.androidUploaded = false
        this.deployModal.androidErrorText = '上传失败'
        this.deployModal.androidLoading = false
      },
      showUploadErrorForIos(error) {
        this.loading = false
        this.deployModal.iosUploaded = false
        this.deployModal.iosErrorText = '上传失败'
        this.deployModal.iosLoading = false
      },
      showUploadSuccessForAndroid(response) {
        this.loading = false
        this.deployModal.androidUploaded = true
        this.deployModal.androidErrorText = ''
        this.deployModal.androidLoading = false
        this.deployModal.item.androidUrl = response.data
      },
      showUploadSuccessForIos(response) {
        this.loading = false
        this.deployModal.iosUploaded = true
        this.deployModal.iosErrorText = ''
        this.deployModal.iosLoading = false
        this.deployModal.item.iosUrl = response.data
      },
      showFormatErrorForAndroid() {
        this.deployModal.androidUploaded = false
        this.deployModal.androidErrorText = '文件格式必须是apk'
      },
      showFormatErrorForIos() {
        this.deployModal.iosUploaded = false
        this.deployModal.iosErrorText = '文件格式必须是ipa'
      },
      closeModal() {
        this.deployModal.item = {
          id: 0,
          name: '',
        }
        this.deployModal.androidLoading = false
        this.deployModal.iosLoading = false
        this.deployModal.androidErrorText = ''
        this.deployModal.iosErrorText = ''
        this.deployModal.androidUploaded = false
        this.deployModal.iosUploaded = false
        this.deployModal.open = false
      },
      deploy() {
        if (this.deployModal.item.androidType && !this.deployModal.androidUploaded) {
          this.deployModal.androidErrorText = '必须上传安卓应用'
          return
        }
        if (this.deployModal.item.iosType && !this.deployModal.iosUploaded) {
          this.deployModal.iosErrorText = '必须上传苹果应用'
          return
        }
        this.loading = true
        this.deployModal.androidLoading = true
        this.deployModal.iosLoading = true
        let data = {
          id: this.deployModal.item.id,
          status: this.deployModal.item.status.name,
          androidUrl: this.deployModal.item.androidUrl,
          iosUrl: this.deployModal.item.iosUrl
        }
        API.deploy(data).then(res => {
          this.loading = false
          Message.success('部署成功')
          this.deployModal.item.deployed = true
          this.closeModal()
        }).catch(ex => {
          this.loading = false
        })
      },
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
        this.$store.commit('setQueryInfo', { queryInfo: this.queryInfo, routeName: this.$router.currentRoute.name })
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantShopApplicationEdit',
          params: {
            id
          }
        })
      },
    },
    mounted: function () {
      let res = this.$store.state.app.tagNavList.filter(item => item.name !== 'MerchantShopApplicationEdit')
      this.$store.commit('setTagNavList', res)
      this.load()
    },
    updated: function () {
      let routeName = this.$router.currentRoute.name
      let queryInfo = this.$store.state.app.queryInfo[routeName]
      if (queryInfo) {
        this.$store.commit('setQueryInfo', { queryInfo: null, routeName })
        this.queryInfo = queryInfo
        this.changePage()
      }
    }
  }
</script>
