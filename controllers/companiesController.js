'use strict';

var atob = require('atob');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Company = require('../models/company');

exports.signUp = async ctx => {
  const userData = ctx.request.body;

  let user = await Company.findOne({username: userData.username});

  if (user) {
    ctx.status = 400;
    ctx.body = 'Username already exist!';
  } else {
    const saltRounds = 10;
    const plaintextPsw = userData.password;
    const hashPsw = await bcrypt.hash(plaintextPsw, saltRounds);

    const company = {
      company_name: userData.company_name,
    	email: userData.email,
    	username: userData.username,
    	password: hashPsw,
    	fleet:[]
    }

    const response = await Company.create(company);
    ctx.body = {
      company_name: response.company_name,
      username: response.username,
      email: response.email
    }
    ctx.status = 201;

  }


};
