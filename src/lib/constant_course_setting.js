export const CourseSetting = [{
    key: 1,
    name: '思维',
    grades: [
        {
            key: 'A1',
            name: '3-4岁',
            terms: [
                { key: 5, name: '暑秋', default_lesson_count: 22 },
                { key: 6, name: '寒春', default_lesson_count: 22 },
            ]
        },
        {
            key: 'A2',
            name: '4-5岁',
            terms: [
                { key: 5, name: '暑秋', default_lesson_count: 22 },
                { key: 6, name: '寒春', default_lesson_count: 22 },
            ]

        },
        {
            key: 'A3',
            name: '5-6岁',
            terms: [
                { key: 5, name: '暑秋', default_lesson_count: 22 },
                { key: 6, name: '寒春', default_lesson_count: 22 },
            ]

        }
    ],
    terms: [
        { key: 5, name: '暑秋' },
        { key: 6, name: '寒春' },
    ]
},
{
    key: 2,
    name: '情商',
    grades: [
        {
            key: 'H1',
            name: '3-4.5岁',
            terms: [
                { key: 5, name: '暑秋', default_lesson_count: 24 },
                { key: 6, name: '寒春', default_lesson_count: 24 },
            ]
        },
        {
            key: 'H2',
            name: '4.5-6岁',
            terms: [
                { key: 5, name: '暑秋', default_lesson_count: 24 },
                { key: 6, name: '寒春', default_lesson_count: 24 },
            ]

        },
    ],
    terms: [
        { key: 5, name: '暑秋' },
        { key: 6, name: '寒春' },
    ]

},
{
    key: 3,
    name: '体能',
    grades: [

        {
            key: 'B1',
            name: '2-4岁',
            terms: [{ key: 7, name: '全年', default_lesson_count: 50 }]

        },
        {
            key: 'B2',
            name: '4-5岁',
            terms: [{ key: 7, name: '全年', default_lesson_count: 50 }]

        },
        {
            key: 'B3',
            name: '5-6岁',
            terms: [{ key: 7, name: '全年', default_lesson_count: 50 }]

        },
        {
            key: 'B4',
            name: '6-8岁',
            terms: [{ key: 7, name: '全年', default_lesson_count: 50 }]

        },
        {
            key: 'B5',
            name: '8-9岁',
            terms: [{ key: 7, name: '全年', default_lesson_count: 50 }]
        },
    ],
    terms: [
        { key: 7, name: '全年', default_lesson_count: 50 }]

}]
export const ClassTypeSetting = [
    { key: 1, name: '周末班', enable: true },
    { key: 2, name: '平时班', enable: process.env.VUE_APP_TEST },
    { key: 3, name: '短期班', enable: process.env.VUE_APP_TEST },
    { key: 4, name: '连续班', enable: process.env.VUE_APP_TEST },
    { key: 5, name: '试听班', enable: true },
]
if (process.env.VUE_APP_TEST) {
    ClassTypeSetting.push({ key: 99, name: '测试班', enable: true })
}
export const TermsSetting = [
    { key: 5, name: '暑秋', enable: true },
    { key: 6, name: '寒春', enable: true },
    { key: 7, name: '全年', enable: true },
    { key: 1, name: '暑假', enable: false },
    { key: 2, name: '秋季', enable: false },
    { key: 3, name: '寒假', enable: false },
    { key: 4, name: '春季', enable: false },
]

export const GradesSetting = [
    {
        key: 'A1',
        name: '3-4岁',
    },
    {
        key: 'A2',
        name: '4-5岁',

    },
    {
        key: 'A3',
        name: '5-6岁',
    },
    {
        key: 'H1',
        name: '3-4.5岁',

    },
    {
        key: 'H2',
        name: '4.5-6岁',
    },
    {
        key: 'B1', name: '2-4岁',
    },
    {
        key: 'B2', name: '4-5岁',
    },

    {
        key: 'B3',
        name: '5-6岁',
    },
    {
        key: 'B4',
        name: '6-8岁',
    },
    {
        key: 'B5',
        name: '8-9岁',
    },]