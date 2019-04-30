<style>
  .unpass {
    background-image: url('../../../../assets/images/img_stamp_unpass.png');
    width: 100px;
    height: 100px;
    position: absolute;
    z-index: 100;
    background-repeat: no-repeat;
    top: 10px;
    left: 300px;
  }

  .pass {
    background-image: url('../../../../assets/images/img_stamp_pass.png');
    width: 100px;
    height: 100px;
    position: absolute;
    z-index: 100;
    background-repeat: no-repeat;
    top: 10px;
    left: 300px;
  }
</style>
<template>
  <div>
    <Card>
      <p slot="title">
        店铺申请审核 ({{form.statusText}})
      <div class="unpass" v-if="!(isUnPay || isChecking || !isUnPassed)"></div>
      <div class="pass" v-if="!(isUnPay || isChecking || isUnPassed)"></div>
      </p>
      <div slot="extra" v-if="isChecking">
        <Button @click="save" type="primary" class="margin-right"
                :loading="loading">保存
        </Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <div slot="extra" v-else>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="100">
        <FormItem label="审核状态" v-if="!isChecking" prop="statusText">
          <Input :value="form.statusText" readonly></Input>
        </FormItem>
        <FormItem label="审核状态" v-else prop="statusType">
          <Select v-model="form.status" style="width:200px">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label="失败原因" v-if="isUnPassed" prop="reason">
          <Input v-model="form.reason" :readonly="!isChecking && isUnPassed" type="textarea"
                 :autosize="{minRows: 2, maxRows: 5}"></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input v-model="form.username" readonly></Input>
        </FormItem>
        <FormItem label="店铺名称" prop="name">
          <Input v-model="form.name" readonly></Input>
        </FormItem>
        <FormItem label="店铺二级域名" prop="username">
          <Input v-model="form.domain" readonly></Input>
        </FormItem>
        <FormItem label="logo" prop="logo">
          <img :src="logoUrl"/>
        </FormItem>
        <FormItem label="店铺类型">
          <Checkbox :value="true" disabled>H5版</Checkbox>
          <Checkbox v-model="form.androidType" disabled>Android版</Checkbox>
          <Checkbox v-model="form.iosType" disabled>IOS版</Checkbox>
        </FormItem>
        <FormItem v-if="form.androidType || form.iosType" prop="types" label="店铺图标">
          <img :src="androidSmallIconUrl" width="180" height="180" class="float-left"
               style="margin-right: 20px;" v-if="form.androidType"/>
          <img :src="androidBigIconUrl" width="180" height="180" class="float-left" style="margin-right: 20px;"
               v-if="form.androidType"/>
          <img :src="iosSmallIconUrl" width="180" height="180" class="float-left" style="margin-right: 20px;"
               v-if="form.iosType"/>
          <img :src="iosBigIconUrl" width="180" height="180" class="float-left" style="margin-right: 20px;"
               v-if="form.iosType"/>
          <div class="clearfix"></div>
        </FormItem>
        <FormItem label="App引导页" prop="instructions">
          <Img v-for="item in form.instructions" :url="item" :imgPrefix="imgPrefix"/>
          <div class="clearfix"></div>
        </FormItem>
        <FormItem label="登录背景图" prop="loginBgImg">
          <img :src="loginBgUrl"/>
        </FormItem>
        <FormItem label="店铺说明" prop="description">
          <Input v-model="form.description" type="textarea" readonly :autosize="{minRows: 2, maxRows: 5}"></Input>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/merchant-shop-application'
  import {Message} from 'iview'
  import config from '@/config/index'
  import uploadPlaceholder from '@/assets/images/upload-placeholder.png'
  import Img from './img'

  export default {
    name: 'MerchantShopApplicationEdit',
    components: {
      Img
    },
    data() {
      return {
        loading: false,
        imgPrefix: config.baseUrl + '/merchant/shop/application/img/load?filePath=',
        statusList: [
          {
            value: 'Passed',
            text: '已通过'
          },
          {
            value: 'UnPassed',
            text: '未通过'
          }
        ],
        form: {
          id: null,
          name: '',
          domain: '',
          androidType: false,
          iosType: false,
          logo: null,
          androidBigIcon: null,
          androidSmallIcon: null,
          iosBigIcon: null,
          iosSmallIcon: null,
          instructions: [],
          loginBgImg: null,
          types: null,
          description: null,
          status: '',
          statusText: ''
        },
        status: '',
        rules: {
          statusType: [
            {required: false, message: '审核状态不能为空', trigger: 'change'}
          ],
          reason: [
            {required: false, message: '失败原因不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      load() {
        if (this.form.id) {
          this.loading = true
          API.load(this.form.id).then(data => {
            let status = data.status
            data.status = status.name
            data.statusText = status.text
            this.form = data
            this.status = status.name
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        }
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.save(this.form).then(res => {
              this.loading = false
              Message.success('保存成功')
              this.goList()
            }).catch(ex => {
              this.loading = false
            })
          }
        })
      },
      goList() {
        this.$router.push({
          name: 'MerchantShopApplicationList'
        })
      },
    },
    computed: {
      isUnPay() {
        let isUnPay = this.status === 'UnPay'
        return isUnPay
      },
      isChecking() {
        let isChecking = this.status === 'Checking'
        return isChecking
      },
      isUnPassed() {
        let isUnPassed = this.form.status === 'UnPassed'
        this.rules.reason[0].required = isUnPassed
        this.rules.statusType[0].required = this.form.status === 'Checking'
        return isUnPassed
      },
      loginBgUrl() {
        return this.form.loginBgImg ? this.imgPrefix + this.form.loginBgImg : uploadPlaceholder
      },
      logoUrl() {
        return this.form.logo ? this.imgPrefix + this.form.logo : uploadPlaceholder
      },
      androidSmallIconUrl() {
        return this.form.androidSmallIcon ? this.imgPrefix + this.form.androidSmallIcon : uploadPlaceholder
      },
      androidBigIconUrl() {
        return this.form.androidBigIcon ? this.imgPrefix + this.form.androidBigIcon : uploadPlaceholder
      },
      iosSmallIconUrl() {
        return this.form.iosSmallIcon ? this.imgPrefix + this.form.iosSmallIcon : uploadPlaceholder
      },
      iosBigIconUrl() {
        return this.form.iosBigIcon ? this.imgPrefix + this.form.iosBigIcon : uploadPlaceholder
      },
    },
    mounted: function () {
      this.form.id = this.$router.currentRoute.params.id
      this.form.id = this.form.id != 0 ? this.form.id : null;
      this.load()
    }
  }
</script>
