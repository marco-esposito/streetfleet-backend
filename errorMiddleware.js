module.exports = async (ctx, next) => {
  try {
    console.log('Request: ', ctx.request.body, next);
    await next();
  } catch (err) {
    ctx.status = 500;
    console.log('Kimba: ',err, 'my Typeerror: ',typeof err);
    // if (typeof Error.HTTPError === 'object') {
    if (typeof err === 'HTTPError') {
      ctx.status = err.status;
    }
    ctx.body = { errors: [err.message] };
    // ctx.app.emit('error', err, this);
  }
};