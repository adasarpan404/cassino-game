export async function attachBaseHeaders(req, res, next) {
  req.baseHeaders = {
    invalid_token: 0,
    refresh_token: "",
    app_type: req.headers.app_type ? req.headers.app_type : "web",
    app_version: req.headers.app_version ? req.headers.app_version : "1.0"
  };
  next();
}
