<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}用户
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="back" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="用户名" prop="username">
          <Input v-model="form.username" :readonly="readOnly"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="form.email" placeholder="输入邮箱"></Input>
        </FormItem>
        <FormItem label="密码" prop="password" :class="{hidden: readOnly}">
          <Input v-model="form.password" :readonly="readOnly"></Input>
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input v-model="form.mobile" placeholder="输入手机号"></Input>
        </FormItem>
        <FormItem label="状态">
          <Select v-model="form.enabled" style="width:200px">
            <Option v-for="status in statusList" :value="status.value" :key="status.value">{{ status.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label="角色">
          <MultiSelectors :leftList="roleLeftList" :rightList="roleRightList" :originLeftList="originRoleLeftList"
                          :originRightList="originRoleRightList" @set-multi-selectors-data="setRoleLists"/>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import API from '@/api/users'
import RoleAPI from '@/api/role'
import MultiSelectors from '@/components/multi-selectors/multi-selectors'
import { Message } from 'iview'

export default {
  name: 'UserEdit',
  components: {
    MultiSelectors
  },
  data () {
    return {
      loading: false,
      form: {
        id: null,
        username: '',
        email: '',
        password: '',
        mobile: '',
        enabled: true,
        roles: []
      },
      statusList: [
        {text: '使用中', value: true},
        {text: '禁用中', value: false}
      ],
      roles: [],
      originRoleLeftList: [],
      originRoleRightList: [],
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    load () {
      if (this.form.id) {
        this.loading = true
        API.load(this.form.id).then(data => {
          this.form = data
          let arr = []
          for (let i in data.roles) {
            let item = data.roles[i]
            arr.push({
              key: item.id,
              text: item.name,
              selected: false
            })
          }
          this.roleRightList = arr
          this.originRoleRightList = arr.concat()
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      }
    },
    loadRoles () {
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
          let arr = []
          for (let i in result.list) {
            let item = result.list[i]
            arr.push({
              key: item.id,
              text: item.name,
              selected: false
            })
          }
          this.roleLeftList = arr
          this.originRoleLeftList = arr.concat()
        }
        this.loading = false
      }).catch(ex => {
        this.loading = false
      })
    },
    save () {
      this.loading = true
      API.save(this.form).then(res => {
        this.loading = false
        Message.success('保存成功')
        this.back()
      }).catch(ex => {
        this.loading = false
      })
    },
    back () {
      this.$store.commit('closeTag', this.$router.currentRoute)
      this.$router.push({
        name: 'UserList'
      })
    },
    setRoleLists (leftList, rightList, reload) {
      this.roleLeftList = leftList
      this.roleRightList = rightList
      if (reload) {
        this.originRoleLeftList = leftList.concat()
        this.originRoleRightList = rightList.concat()
      }
    }
  },
  computed: {
    action () {
      return !this.readOnly ? '编辑' : '新增'
    },
    readOnly () {
      return this.form.id != null && this.form.id !== '0'
    },
    roleLeftList: {
      get () {
        let arr = []
        for (let i in this.roles) {
          let item = this.roles[i]
          arr.push({
            key: item.id,
            text: item.name,
            selected: item.selected ? true : false
          })
        }
        return arr
      },
      set (arr) {
        this.roles = []
        for (let i in arr) {
          let item = arr[i]
          this.roles.push({
            id: item.key,
            name: item.text,
            selected: item.selected
          })
        }
      }
    },
    roleRightList: {
      get () {
        let arr = []
        for (let i in this.form.roles) {
          let item = this.form.roles[i]
          arr.push({
            key: item.id,
            text: item.name,
            selected: item.selected ? true : false
          })
        }
        return arr
      },
      set (arr) {
        this.form.roles = []
        for (let i in arr) {
          let item = arr[i]
          this.form.roles.push({
            id: item.key,
            name: item.text,
            selected: item.selected
          })
        }
      }
    }
  },
  mounted: function () {
    this.form.id = this.$router.currentRoute.params.id
    this.form.id = this.form.id !== '0' ? this.form.id : null;
    this.load()
    this.loadRoles()
  }
}
</script>
