<template>
    <div class="error500">
        <div class="error500-body-con">
            <el-card>
                <div class="error500-body-con-title">
                    5<span class="error500-0-span"><i class="iconfont icon-social-freebsd-devil"></i></span><span class="error500-0-span"><i class="iconfont icon-social-freebsd-devil"></i></span>
                </div>
                <p class="error500-body-con-message">Oops! the server is wrong</p>
                <div class="error500-btn-con">
                    <el-button @click="goHome" size="large" style="width: 200px;" type="text">返回首页</el-button>
                    <el-button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Error500',
    methods: {
        backPage () {
            this.$router.go(-1);
        },
        goHome () {
            this.$router.push({
                name: 'home_index'
            });
        }
    }
};
</script>