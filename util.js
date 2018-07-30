const jwtDecode = require('jwt-decode');

function getTokenPayLoad(req) {
  const authHeader = req.get('Authorization') || '';
  const authToken = authHeader.replace('Bearer', '').trim();
  return jwtDecode(authToken);
}

function emitUpdateBill(req, action) {
  const tokenPayload = getTokenPayLoad(req);
  const io = req.app.get('socket');
  const name = tokenPayload.full_name || tokenPayload.username;

  io.sockets.emit('updateBill', JSON.stringify({ username: tokenPayload.username, message: `${name} đã ${action}` }));
}

function getRootPath() {
  return __dirname;
};

module.exports = {
  getRootPath: getRootPath,
  emitUpdateBill: emitUpdateBill
}
