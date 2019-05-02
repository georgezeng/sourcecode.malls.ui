<style>
  .unpass {
    background-image: url('../../../assets/images/img_stamp_unpass.png');
    width: 100px;
    height: 100px;
    position: absolute;
    z-index: 100;
    background-repeat: no-repeat;
    top: 10px;
    left: 300px;
  }

  .pass {
    background-image: url('../../../assets/images/img_stamp_pass.png');
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
        实名认证审核 ({{form.statusText}})
      <div class="unpass" v-if="!(isChecking || !isUnPassed)"></div>
      <div class="pass" v-if="!(isChecking || isUnPassed)"></div>
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
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="审核状态" :class="{hidden: isChecking}" prop="statusText">
          <Input :value="form.statusText" readonly></Input>
        </FormItem>
        <FormItem label="审核状态" v-if="isChecking" prop="statusType">
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
        <FormItem label="商家名称" prop="name">
          <Input v-model="form.name" readonly></Input>
        </FormItem>
        <FormItem label="证件类型" prop="type">
          <Input v-model="form.typeText" readonly></Input>
        </FormItem>
        <FormItem label="证件号码" prop="number">
          <Input v-model="form.number" readonly></Input>
        </FormItem>
        <FormItem label="证件照" prop="photo">
          <img :src="imgPreviewUrl"/>
        </FormItem>
        <FormItem label="联系人" prop="contact">
          <Input v-model="form.contact" readonly></Input>
        </FormItem>
        <FormItem label="联系电话" prop="phone">
          <Input v-model="form.phone" readonly></Input>
        </FormItem>
        <FormItem label="联系地址" prop="address">
          <Input v-model="form.address" readonly></Input>
        </FormItem>
        <FormItem label="商家介绍" prop="description">
          <Input v-model="form.description" readonly type="textarea" :autosize="{minRows: 2, maxRows: 5}"></Input>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/merchant-verification'
  import {Message} from 'iview'
  import config from '@/config/index'
  import uploadPlaceholder from '@/assets/images/upload-placeholder.png'

  export default {
    name: 'MerchantVerificationEdit',
    components: {},
    data() {
      return {
        loading: false,
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
          username: '',
          name: '',
          type: '',
          typeText: '',
          number: '',
          photo: '',
          contact: '',
          phone: '',
          address: '',
          description: '',
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
            data.typeText = data.type.text
            data.type = data.type.name
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
          name: 'MerchantVerificationList'
        })
      },
    },
    computed: {
      isChecking() {
        let isChecking = this.status === 'Checking'
        // this.rules.statusType[0].required = isChecking
        return isChecking
      },
      isUnPassed() {
        let isUnPassed = this.form.status === 'UnPassed'
        this.rules.reason[0].required = isUnPassed
        this.rules.statusType[0].required = this.form.status === 'Checking'
        return isUnPassed
      },
      imgPreviewUrl() {
        return this.form.photo ? config.baseUrl + '/merchant/verification/file/load/params/' + this.form.id + '?filePath=' + this.form.photo : uploadPlaceholder
      }
    },
    mounted: function () {
      this.form.id = this.$router.currentRoute.params.id
      this.form.id = this.form.id != 0 ? this.form.id : null;
      this.load()
    }
  }
</script>
