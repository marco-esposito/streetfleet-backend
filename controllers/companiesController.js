'use strict';

var atob = require('atob');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Company = require('../models/company');

exports.signUp = async ctx => {
  const userData = ctx.request.body;
  let user = await Company.findOne({username: userData.username});

  const incompleteBody = !userData.company_name || !userData.username || !userData.email || !userData.password;

  if (user) {
    ctx.status = 400;
    ctx.body = 'Username already exist!';
  } else if (incompleteBody) {
    ctx.status = 400;
    ctx.body = 'Incomplete body';
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

exports.signIn = async ctx => {
  if (!ctx.headers['authorization']) {
    ctx.status = 400;
    ctx.body = 'Basic authorization in header is missing';
    return;
  }
  const b64 = atob(ctx.headers['authorization'].split(' ').pop());
  const [username, passwordReceived] = b64.split(':');
  const company = await Company.findOne({username: username});
  if (company) {
    const areCompatible = await bcrypt.compare(passwordReceived, company.password);
    if (areCompatible) {
      const payload = {
        username: company.username,
        password: company.password
      }
      ctx.status = 200;
      ctx.body = {
        username: company.username,
        json_token: jwt.sign(payload, "$secretword")
      }
    } else {
      ctx.status = 401;
      ctx.body = 'Unauthorized';
    }
  } else {
    ctx.status = 404;
    ctx.body = 'Username not found';
  }

};
