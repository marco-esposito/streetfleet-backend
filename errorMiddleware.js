module.exports = async (ctx, next) => {
  try {
    // this means that if any errors happen below/after this middleware (from 'next' and beyond), they will fall down into this 'catch'
    await next();
  } catch (err) {
    ctx.status = 500;
    if (typeof err === 'HTTPError') {
      ctx.status = err.status;
    }
    ctx.body = { errors: [err.message] };
  }
};
