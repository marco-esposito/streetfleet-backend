'use strict';
var atob = require('atob');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../models/company');
const HTTPError = require('./../HTTPError');

exports.signUp = async ctx => {
  const userData = ctx.request.body;
  let user = await Company.findOne({ username: userData.username });

  const incompleteBody = !userData.company_name || !userData.username || !userData.email || !userData.password;

  if (user) {
    throw new HTTPError(400, 'This username already exists!');
  } else if (incompleteBody) {
    throw new HTTPError(400, 'Incomplete body');
  } else {
    const saltRounds = 10;
    const plaintextPsw = userData.password;
    const hashPsw = await bcrypt.hash(plaintextPsw, saltRounds);

    const company = {
      company_name: userData.company_name,
      email: userData.email,
      username: userData.username,
      password: hashPsw,
      fleet: []
    };

    // Can we take the try/catch out?
    try {
      const response = await Company.create(company);
      ctx.body = {
        company_name: response.company_name,
        username: response.username,
        email: response.email
      };
      ctx.status = 201;
    } catch (e) {
      throw new HTTPError(500, e.message);
    }
  }
};

exports.signIn = async ctx => {
  if (!ctx.headers['authorization']) {
      throw new HTTPError(400, 'Basic authorization in header is missing.');
    return;
  }
  const b64 = atob(ctx.headers['authorization'].split(' ').pop());
  const [username, passwordReceived] = b64.split(':');
  const company = await Company.findOne({ username: username });
  if (company) {
    const areCompatible = await bcrypt.compare(passwordReceived, company.password);
    if (areCompatible) {
      const payload = {
        username: company.username,
        password: company.password
      };
      ctx.status = 200;
      ctx.body = {
        username: company.username,
        json_token: jwt.sign(payload, '$secretword'),
        company_name: company.company_name,
        email: company.email
      };
    } else {
      throw new HTTPError(401, 'Unauthorized obviously.');
    }
  } else {
    throw new HTTPError(404, 'Username not found.');
  }
};

exports.updateCompany = async ctx => {
  const userData = ctx.request.body;
  const incompleteBody = !userData.company_name || !userData.email || !userData.old_password || !userData.new_password;
  if (incompleteBody) {
    throw new HTTPError(400, 'Bad Request - the request could not be understood or was missing required parameters.(incomplete body)');
    return;
  }
  // ctx.company at this stage is all the company data bc queried earlier in middleware
  const areCompatible = await bcrypt.compare(userData.old_password, ctx.company.password);
  // must hash the password before saving it in database
  const saltRounds = 10;
  const plaintextPsw = userData.new_password;
  const hashPsw = await bcrypt.hash(plaintextPsw, saltRounds);
  if (areCompatible) {
    const updatedVehicle = {
      company_name: userData.company_name,
      email: userData.email,
      password: hashPsw,
    };
    for (let key in updatedVehicle) ctx.company[key] = updatedVehicle[key];
    try {
      await ctx.company.save();
      ctx.status = 200;
      ctx.body = {
        username: ctx.company.username,
        company_name: ctx.company.company_name,
        email: ctx.company.email
      };
    } catch (e) {
      throw new HTTPError(500, e.message);
    }
  } else {
    throw new HTTPError(401, 'The wrong old password was entered');
  }
};

exports.getCompany = ctx => {
  ctx.status = 200;
  ctx.body = ctx.company;
};

exports.deleteCompany = async ctx => {
  try {
    await Company.findOneAndRemove({ username: ctx.company.username });
    ctx.status = 204;
  } catch (e) {
    console.error(e);
    ctx.status = 500;
    ctx.body = {
      errors: [
        'Something was wrong when trying to remove the account.'
      ]
    };
  }
};
