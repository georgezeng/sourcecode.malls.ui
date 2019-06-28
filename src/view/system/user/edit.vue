<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}用户
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="主副" prop="accountText" :class="{hidden: !isEdit}">
          <Input v-model="form.accountText" readonly></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input v-model="form.username" :readonly="isEdit"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="form.email" placeholder="输入邮箱"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="form.password" @on-change="setConfirmPasswordStatus"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="confirmPassword">
          <Input type="password" v-model="form.confirmPassword"></Input>
        </FormItem>
        <FormItem label="头像" prop="header">
          <Upload
            :uploadUrl="uploadUrl"
            :previewUri="form.avatar"
            btnText="上传头像"
            :imgPrefix="imgPrefix"
            :uploadPlaceholder="avatar"
            width="32"
            height="32"
            @setPreviewUrl="setPreviewUrl"
          />
        </FormItem>
        <FormItem label="状态">
          <Select v-model="form.enabled">
            <Option v-for="status in statusList" :value="status.value" :key="status.value">{{ status.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label="角色">
          <Transfer
            :data="roleLeftList"
            :target-keys="roleRightList"
            filterable
            :list-style="{width: '300px', height: '400px'}"
            :filter-method="filterRole"
            @on-change="changeTargetRole"></Transfer>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/users'
  import RoleAPI from '@/api/role'
  import Upload from '@/components/upload/img-one-line-upload'
  import {Message} from 'iview'
  import config from '@/config/index'
  import avatar from '@/assets/images/avatar.png'

  const FAKE_PASSWORD = 'FakePwd123'

  export default {
    name: 'UserEdit',
    components: {
      Upload
    },
    data() {
      let isEdit = this.$router.currentRoute.params.id != 0
      const confirmPwdCheck = (rule, value, callback) => {
        if (this.form.password !== '' && this.form.password !== value) {
          callback(new Error('确认密码与密码不相同'));
        } else {
          callback();
        }
      }
      return {
        avatar,
        loading: false,
        form: {
          id: null,
          accountText: '',
          username: '',
          email: '',
          password: '',
          enabled: 'true',
          avatar: null,
          roles: []
        },
        statusList: [
          {text: '使用中', value: 'true'},
          {text: '禁用中', value: 'false'}
        ],
        roleLeftList: [],
        roleRightList: [],
        rules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'change'},
            {max: 50, message: '用户名不能多于50位', trigger: 'change'}
          ],
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'change'},
            {type: 'email', message: '邮箱格式不正确', trigger: 'change'},
            {max: 50, message: '邮箱不能多于50位', trigger: 'change'}
          ],
          password: [
            {required: !isEdit, message: '密码不能为空', trigger: 'change'},
            {
              type: 'string',
              pattern: /^(?=.*[0-9].*)(?=.*[A-Za-z].*).{8,}$/,
              message: '密码必须数字+字母（区分大小写）并且不少于8位',
              trigger: 'change'
            }
          ],
          confirmPassword: [
            {required: !isEdit, message: '确认密码不能为空', trigger: 'change'},
            {required: !isEdit, validator: confirmPwdCheck, trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      filterRole(data, query) {
        return data.label.indexOf(query) > -1;
      },
      changeTargetRole (newTargetKeys) {
        this.roleRightList = newTargetKeys;
        this.form.roles = []
        for (let i in this.roleRightList) {
          const key = this.roleRightList[i]
          for (let j in this.roleLeftList) {
            const item = this.roleLeftList[j]
            if (item.key == key) {
              this.form.roles.push({
                id: key
              })
              break
            }
          }
        }
      },
      load() {
        if (this.form.id) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            this.form.enabled = data.enabled === true ? 'true' : 'false'
            let arr = []
            for (let i in data.roles) {
              let item = data.roles[i]
              arr.push(item.id)
            }
            this.form.password = FAKE_PASSWORD
            this.form.confirmPassword = FAKE_PASSWORD
            this.roleRightList = arr
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        }
      },
      loadRoles() {
        this.loading = true
        RoleAPI.list({
          data: null,
          page: {
            num: 1,
            size: 99999999,
            property: 'name',
            order: 'ASC'
          }
        }).then(result => {
          if (result.total > 0) {
            const arr = []
            for (let i in result.list) {
              let item = result.list[i]
              arr.push({
                key: item.id,
                label: item.name
              })
            }
            this.roleLeftList = arr
          }
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            let data = {...this.form}
            if(data.password === FAKE_PASSWORD) {
              data.password = null
              data.confirmPassword = null
            }
            this.loading = true
            API.save(data).then(res => {
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
          name: 'UserList'
        })
      },
      setPreviewUrl(url, index) {
        this.form.avatar = url
      },
      setConfirmPasswordStatus() {
        let required = this.form.password !== ''
        this.rules.confirmPassword[0].required = required
        this.rules.confirmPassword[1].required = required
      }
    },
    computed: {
      action() {
        return this.isEdit ? '编辑' : '新增'
      },
      isEdit() {
        return this.form.id != null && this.form.id != 0
      },
      uploadUrl() {
        return config.baseUrl + '/user/file/upload/params' + this.form.id
      },
      imgPrefix() {
        return config.baseUrl + '/user/file/load/params/' + this.form.id + '?filePath='
      }
    },
    mounted: function () {
      this.form.id = this.$router.currentRoute.params.id
      let isEdit = this.form.id != 0
      this.form.id = isEdit ? this.form.id : null;
      this.rules.password[0].required = !isEdit
      this.load()
      this.loadRoles()
    }
  }
</script>
