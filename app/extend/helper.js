'use strict';


module.exports = {

  /**
   * 获取数据源中需要的参数，不存在则跳过，不支持深层数据的获取。
   * @param rule 需要获取的参数，若不存在则跳过，这里不会进行数据的校验
   * @param paras 数据源
   * @return {{}} 封装好的对象
   */
  buildObj(rule, paras) {
    const obj = {};
    const keys = Object.keys(rule);
    for (const key of keys) {
      console.log(key);
      paras.hasOwnProperty(key) ? obj[key.valueOf()] = paras[key] : null;
    }

    return obj;
  },

  /**
   * 将id字符串包装为objectId
   * @param id
   */
  wrapperObjectId(id) {
    const { app } = this;
    return app.mongoose.Types.ObjectId(id);
  },

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
