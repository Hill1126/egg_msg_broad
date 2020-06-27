'use strict';

const Joi = require('joi');
const JOI = Symbol('paras checker');

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

};
