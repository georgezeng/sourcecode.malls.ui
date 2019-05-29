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
      <Form>
        <FormItem label="域名">
          <Input v-model="deployModal.item.domain" />
        </FormItem>
        <FormItem v-if="deployModal.item.androidType" label="">
          <Upload
                  :uploadUrl="uploadUrl"
                  :formats="['apk']"
                  :maxSize="100000"
                  :loading="loading"
                  btnText="上传安卓应用"
                  btnIcon="logo-android"
                  :tempErrorText="deployModal.androidErrorText"
                  @setPreviewUrl="setAndroidUrl"
                  @setLoading="setLoading"
                  @clearTempErrorText="clearAndroidErrorText"
          />
        </FormItem>
        <FormItem v-if="deployModal.item.iosType" label="">
          <Upload
                  :uploadUrl="uploadUrl"
                  :formats="['ipa']"
                  :maxSize="100000"
                  :loading="loading"
                  btnText="上传苹果应用"
                  btnIcon="logo-apple"
                  :tempErrorText="deployModal.iosErrorText"
                  @setPreviewUrl="setIosUrl"
                  @setLoading="setLoading"
                  @clearTempErrorText="clearIosErrorText"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="warning" :loading="loading" @click="closeModal">取消</Button>
        <Button type="primary" :loading="loading" @click="deploy">部署</Button>
      </div>
    </Modal>

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
      editPageName="MerchantShopApplicationEdit"
      :filteredPageNames="['MerchantShopApplicationEdit']"
      :listHandler="listHandler"
      :queryData="data"
      @setLoading="setLoading"
      @setGoEdit="setGoEdit"
      @setQueryData="setQueryData"
    >
    </CommonTable>
  </div>
</template>
<script>
  import API from '@/api/merchant-shop-application'
  import {Message} from 'iview'
  import config from '@/config/index'
  import CommonTable from '@/components/tables/common-table'
  import Upload from '@/components/upload/file-single-upload'

  export default {
    name: 'MerchantShopApplicationList',
    components: {
      CommonTable,
      Upload
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
            value: 'UnPay',
            label: '未支付'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        deployModal: {
          open: false,
          androidUploaded: false,
          iosUploaded: false,
          androidErrorText: '',
          iosErrorText: '',
          item: {
            id: 0,
            name: null,
            domain: null,
            iosUrl: null,
            androidUrl: null
          }
        },
        data: {
          statusText: 'Checking',
          searchText: ''
        },
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
                    disabled: params.row.status.name !== 'Passed'
                  },
                  style: {
                    marginLeft: '10px'
                  },
                  on: {
                    'click': () => {
                      this.deployModal.item = params.row
                      this.deployModal.open = true
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
      uploadUrl() {
        return config.baseUrl + '/merchant/shop/application/file/upload/params/' + this.deployModal.item.id
      },
    },
    methods: {
      clearAndroidErrorText() {
        this.deployModal.androidErrorText = ''
      },
      clearIosErrorText() {
        this.deployModal.iosErrorText = ''
      },
      setLoading(loading) {
        this.loading = loading
      },
      setIosUrl(url) {
        this.deployModal.iosUploaded = true
        this.deployModal.item.iosUrl = url
      },
      setAndroidUrl(url) {
        this.deployModal.androidUploaded = true
        this.deployModal.item.androidUrl = url
      },
      closeModal() {
        this.deployModal.item = {
          id: 0,
          name: '',
          domain: null,
          iosUrl: null,
          androidUrl: null
        }
        this.deployModal.androidUploaded = false
        this.deployModal.androidErrorText = ''
        this.deployModal.iosUploaded = false
        this.deployModal.iosErrorText = ''
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
        this.setLoading(true)
        let data = {
          id: this.deployModal.item.id,
          domain: this.deployModal.item.domain,
          status: this.deployModal.item.status.name,
          androidUrl: this.deployModal.item.androidUrl,
          iosUrl: this.deployModal.item.iosUrl
        }
        API.deploy(data).then(res => {
          this.setLoading(false)
          Message.success('部署成功')
          this.closeModal()
        }).catch(ex => {
          this.setLoading(false)
        })
      },
      listHandler: API.list,
      setQueryData(data) {
        this.data.searchText = data.searchText
      },
      setGoEdit(callback) {
        this.goEdit = callback
      }
    },
  }
</script>
