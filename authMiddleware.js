//middleware for authentication
// From this middleware on, ctx is appended with company (the company information). That is available to all the routes now.
const jwt = require('jsonwebtoken');
const Company = require('./models/company');

module.exports = async (ctx, next) => {
  let token = ctx.headers['authorization'];
  if (!token || token.split(' ')[0] === 'Basic') return await next();
  token = token.split(' ').pop(); // for JWT token
  let decoded;
  try {
    decoded = jwt.verify(token, 'process.env.secret');
  } catch (e) {
    return await next();
  }
  ctx.company = await Company.findOne({username: decoded.username});
  await next();
};
