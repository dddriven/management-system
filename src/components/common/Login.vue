<template>
	<div class="log_container">
		<div class="login_box">
			<div class="avatar-box">
				<img src="../../assets/img/logo.png">
			</div>
			<el-form :model="loginForm"
							:rules="loginFormRules"
							label-width="0px"
							class="login-form"
							ref="loginFormRef">
				<el-form-item prop="username">
					<el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model="loginForm.password"
										prefix-icon="iconfont icon-3702mima"
										type="password"></el-input>
				</el-form-item>
				<el-form-item class="btns">
					<el-button type="primary" @click="login">登录</el-button>
					<el-button type="info" @click="resetLoginForm">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Login",
		methods: {
			resetLoginForm() {
				this.$refs.loginFormRef.resetFields()
			},
			login() {
				this.$refs.loginFormRef.validate(async valid => {
					if(!valid) return
					const {data: res} = await this.$http.post("login", this.loginForm)
					if(res.meta.status !== 200) return this.$message.error("登录失败")
					this.$message.success("登录成功")
					window.sessionStorage.setItem("token", res.data.token)
					this.$router.push("/home")
				})
			}
		},
		data() {
			return {
				loginForm: {
					username: 'admin',
					password: '123456'
				},
				loginFormRules: {
					username: [
						{required: true, message: "请输入登录名称", trigger: "blur"},
						{min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur"}
					],
					password: [
						{required: true, message: "请输入登录密码", trigger: "blur"},
						{min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur"}
					]
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.log_container {
		background-color: #2b4b6b;
		height: 100%;
	}
	.login_box {
		width: 450px;
		height: 300px;
		background-color: #fff;
		border-radius: 3px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.avatar-box {
		height: 130px;
		width: 130px;
		border-radius: 50%;
		padding: 10px;
		border: 1px solid #eee;
		box-shadow: 0 0 10px #ddd;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			background-color: #eee;
		}
	}

	.btns {
		display: flex;
		justify-content: flex-end;
	}

	.login-form{
		width: 100%;
		position: absolute;
		bottom: 0;
		padding: 0 20px;
		box-sizing: border-box;
	}
</style>
