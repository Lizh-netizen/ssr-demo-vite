export default function formatTime () {
const today = new Date();
const year = today.getFullYear();
let month = today.getMonth() + 1;
month = month < 10 ? `0${month}` : month; // 确保月份是两位数
let day = today.getDate();
day = day < 10 ? `0${day}` : day; // 确保日期是两位数

const formattedToday = `${year}-${month}-${day}`;
return formattedToday
}

