function generic(res, err, data) {
  if (err) {
    return apiError(res, err);
  }

  if (!data) {
    data = {};
  }

  return res.jsonp(data);
}
exports.generic = generic;

function error(res, err) {
  return res.json({
    error: err
  });
}
exports.error = error;