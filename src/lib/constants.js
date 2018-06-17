export const Classroom_Type = {
    1: "思维",
    2: "情商",
    3: "体能",

};
export const SubjectName = {
    1: '思维',
    2: '情商',
    3: '体能',

}
/**
◇ 周末班：每周六或周日上课，1次课/周
◇ 平时班：周一到周五的任意一天上课，1次课/周
◇ 短期班：连续每天上课，班级名称可自定义（如：幼升小冲刺班）
◇ 连续班：连续每天上课
◇ 试听班：短期试听 （1讲）
 */
export const ClassType = {
    1: '周末班',
    2: '平时班',
    3: '短期班',
    4: '连续班',
    5: '试听班',

}
if (process.env.VUE_APP_TEST) {
    ClassType[99] = "测试班"
}


export const Terms = {
    5: '暑秋',
    6: '寒春',
    7: '全年',
    1: '暑假',
    2: '秋季',
    3: '寒假',
    4: '春季',

}

export const Grade = {
    A1: '3-4岁',
    A2: '4-5岁',
    A3: '5-6岁',
    H1: '3-4.5岁',
    H2: '4.5-6岁',
    B1: '2-4岁',
    B2: '4-5岁',
    B3: '5-6岁',
    B4: '6-8岁',
    B5: '8-9岁',
}
export const ClazzState = {
    0: '未开课',
    1: '开课中',
    2: '已结课',
    3: '已关闭',
}
export const JobTitles = [
    { key: 'investor', name: '投资人', show: false },
    { key: 'teacher', name: '教师', show: true },
    { key: 'consultant', name: '顾问', show: true },
    { key: 'teaching_manager', name: '教学管理', show: true },
    { key: 'school_manager', name: '校区管理', show: true }
]
export const JobTypes = [
    { value: 0, label: "全职" },
    { value: 1, label: "专职" },
    { value: 2, label: "兼职" }
]
export const Educations = [
    { name: '大专以下', key: 'secondary' },
    { name: '大专', key: 'college' },
    { name: '本科/学士', key: 'bachelor' },
    { name: '研究生/硕士', key: 'master' },
    { name: '博士', key: 'doctor' }
]