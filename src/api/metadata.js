const _titles = [
    { key: 'investor', name: '投资人', show: false },
    { key: 'teacher', name: '教师', show: true },
    { key: 'consultant', name: '顾问', show: true },
    { key: 'teaching_manager', name: '教学管理', show: true },
    { key: 'school_manager', name: '校区管理', show: true }
]
const _educations = [
    { name: '大专以下', key: 'secondary' },
    { name: '大专', key: 'college' },
    { name: '本科/学士', key: 'bachelor' },
    { name: '研究生/硕士', key: 'master' },
    { name: '博士', key: 'doctor' }
]
async function educations() {
    return _educations;
}
async function titles() {
    let list = _titles.filter(p => p.show);
    return list;
}
export default {
    educations,
    titles
}