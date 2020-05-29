
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

};
