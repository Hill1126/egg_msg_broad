'use strict';


module.exports = {

  /**
   * 根据给出的日期对象，转换为 yyyy-mm-dd:hh-MM
   * @param date 要转换的日期对象
   * @return dateString 日期字符串
   */
  parseDateString(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();
    let min = date.getMinutes();
    let seconds = date.getSeconds();
    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    if (min < 10) {
      min = '0' + min;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return `${year}-${month}-${dt} ${date.getHours()}:${min}:${seconds}`;
  },


};
