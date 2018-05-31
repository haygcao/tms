import * as constants from "@/lib/constants";
const { ClassType, SubjectName, Terms, Grade, ClazzState } = constants
export const capitalize = function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
}
function formatMoney(number, places, symbol, thousand, decimal) {
    number = number || 0;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}
export const money = (val) => {
    return formatMoney(val, 2, '¥', '');
}
export const numberToCn = function (number) {
    var SYMBOLS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    var UNIT_MAP = {
        '0': '',
        '1': '十',
        '2': '百',
        '3': '千',
        '4': '零万',
        '5': '十',
        '6': '百',
        '7': '千',
        '8': '零亿',
        '9': '十'
    };

    var Y_MAP = [0, 4, 8];

    var _numberTransform = function (input) {
        if (input <= 0 || !parseInt(input, 10)) {
            return '请输入正整数';
        }

        var inputStr = '' + input;
        var inputArr = inputStr.split('').reverse();
        var inputLength = inputArr.length;

        if (inputLength > 10) {
            return '请输入10位以内的正整数';
        }

        var result = '';

        for (var i = 0; i < inputLength; i++) {
            var value = inputArr[i];
            var isY = Y_MAP.indexOf(i) !== -1;

            if (isY || (!isY && value != 0)) {
                result += UNIT_MAP[i];
            }

            result += SYMBOLS[value];
        }

        result = result.split('').reverse().join('');

        result = result.replace(/零+$/, '')
            .replace(/零+/, '零')
            .replace(/零+万/, '万')
            .replace(/零+亿/, '亿')
            .replace(/亿万/, '亿')
            .replace(/^一十/, '十');

        return result;
    }
    return _numberTransform(number);
}


export const toDateTimeString = (time) => {
    // console.log('^^^^^^^^^^^',time);
    if (!time) return '';
    return new Date(time).Format("yyyy-MM-dd hh:mm")
}
export const toTimeString = (time) => {
    if (!time) return '';
    return new Date(time).Format("MM月dd日 hh时mm分ss秒")
}
export const toShortTimeString = (time) => {
    if (!time) return '';
    if (typeof time === 'string') {
        time = '1900-01-01 ' + time;
    }
    return new Date(time).Format("hh:mm")
}
export const toDateString = (time) => {
    if (!time) return '';
    return new Date(time).Format("yyyy/MM/dd")
}
export const age = (birthday) => {
    if (!birthday) return '';
    birthday = new Date(birthday);
    var ageDifMs = Date.now() - birthday.getTime();
    if (ageDifMs < 0) {
        return ''
    }
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    let year = Math.abs(ageDate.getUTCFullYear() - 1970);
    let month = ageDate.getUTCMonth();
    let ret = '';
    if (year > 0) {
        ret += year + '岁'
    }
    if (month > 0) {
        ret += month + '个月'
    }
    return ret;
}
export const weekDay = (date) => {
    let day = new Date(date).getDay();
    return '周' + ['日', '一', '二', '三', '四', '五', '六'][day];
}
// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export const subjectName = function (val) {
    return SubjectName[val] || '--'
}
export const classType = (val) => {
    return ClassType[val] || '--'
}

export const terms = (val) => {
    return Terms[val] || '--'
}
export const grade = (val) => {
    return Grade[val] || '--'
}
export const classState = (val) => {
    return ClazzState[val] || '--'
}
export const gender = (val) => {
    return val == 0 ? '女' : '男'
}
const payType = {
    0: '微信',
    1: '支付宝',
    2: '现金',
    3: '刷卡'
}
export const payment_type = (val) => {

    return payType[val] || '其他'
}
const OrderStatus = {
    0: '已提交',
    1: '待支付',
    2: '已支付',
    3: '已完成',
    11: '已取消',
    12: '已关闭',
}
export const orderState = (val = 0) => {
    return OrderStatus[val] || '--'
}

const JobTitles = {
    investor: '投资人',
    teacher: '教师',
    consultant: '顾问',
    teaching_manager: '教学管理',
    school_manager: '校区管理',
}

export const jobTitle = (val) => {
    return JobTitles[val] || ''
}

