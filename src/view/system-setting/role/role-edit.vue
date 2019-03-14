<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}角色
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="back" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="编号" prop="code">
          <Input v-model="form.code" :readonly="codeReadonly"></Input>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="form.name" placeholder="输入角色名"></Input>
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input v-model="form.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="输入关于角色的一些描述"></Input>
        </FormItem>
        <FormItem label="权限">
          <MultiSelectors :leftList="authLeftList" :rightList="authRightList" :originLeftList="originAuthLeftList"
                          :originRightList="originAuthRightList" @set-multi-selectors-data="setLists"/>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import API from '@/api/role'
import AuthAPI from '@/api/authority'
import MultiSelectors from '@/components/multi-selectors/multi-selectors'
import { Message } from 'iview'

export default {
  name: 'RoleEdit',
  components: {
    MultiSelectors
  },
  data () {
    return {
      loading: false,
      form: {
        id: null,
        name: '',
        code: '',
        description: '',
        authorities: []
      },
      authorities: [],
      originAuthLeftList: [],
      originAuthRightList: [],
      rules: {
        name: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loadData () {
      if (this.form.id) {
        this.loading = true
        API.load(this.form.id).then(data => {
          this.form = data
          let arr = []
          for (let i in data.authorities) {
            let auth = data.authorities[i]
            arr.push({
              key: auth.id,
              text: auth.name,
              selected: false
            })
          }
          this.authRightList = arr
          this.originAuthRightList = arr.concat()
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      }
    },
    loadAuthorities (searchText) {
      this.loading = true
      AuthAPI.list({
        data: searchText ? '' : searchText,
        page: {
          num: 1,
          size: 99999999,
          property: 'code',
          order: 'ASC'
        }
      }).then(result => {
        if (result.total > 0) {
          let arr = []
          for (let i in result.list) {
            let auth = result.list[i]
            arr.push({
              key: auth.id,
              text: auth.name,
              selected: false
            })
          }
          this.authLeftList = arr
          this.originAuthLeftList = arr.concat()
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
        name: 'RoleList'
      })
    },
    setLists (leftList, rightList, reload) {
      this.authLeftList = leftList
      this.authRightList = rightList
      if (reload) {
        this.originAuthLeftList = leftList.concat()
        this.originAuthRightList = rightList.concat()
      }
    }
  },
  computed: {
    action () {
      return this.form.id ? '编辑' : '新增'
    },
    codeReadonly () {
      return this.form.id != null
    },
    authLeftList: {
      get () {
        let arr = []
        for (let i in this.authorities) {
          let auth = this.authorities[i]
          arr.push({
            key: auth.id,
            text: auth.name,
            selected: false
          })
        }
        return arr
      },
      set (arr) {
        this.authorities = []
        for (let i in arr) {
          let item = arr[i]
          this.authorities.push({
            id: item.key,
            name: item.text
          })
        }
      }
    },
    authRightList: {
      get () {
        let arr = []
        for (let i in this.form.authorities) {
          let auth = this.form.authorities[i]
          arr.push({
            key: auth.id,
            text: auth.name,
            selected: false
          })
        }
        return arr
      },
      set (arr) {
        this.form.authorities = []
        for (let i in arr) {
          let item = arr[i]
          this.form.authorities.push({
            id: item.key,
            name: item.text
          })
        }
      }
    }
  },
  mounted: function () {
    this.form.id = this.$router.currentRoute.params.id
    this.loadData()
    this.loadAuthorities()
  }
}
</script>
