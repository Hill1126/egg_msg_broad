'use strict';

const Joi = require('joi');
const JOI = Symbol('paras checker');
const crypto = require('crypto');

module.exports = {

  validate2(schema, valueObj = this.request.body) {
    const { error, value } = Joi.validate(valueObj, schema);
    if (!error) return value;
    error.msg = error.message;
    this.throw(422, error);

  },

  get Joi() {

    if (!this[JOI]) this[JOI] = Joi;
    return this[JOI];
  },

  aesEncrypt(data, key = this.app.config.salt) {

    const cipher = crypto.createCipher('aes192', key);
    let crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  },

  aesDecrypt(encrypted, key = this.app.config.salt) {
    const decipher = crypto.createDecipher('aes192', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;

  },


};
