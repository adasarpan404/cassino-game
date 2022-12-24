class BaseMobileRes {
  constructor(
    invalid_token,
    refresh_token,
    app_type,
    app_version,
    show_message = 0
  ) {
    this.app_type = app_type;
    this.app_version = app_version;
    this.maintainence = 0;
    this.new_version = 0;
    this.force_update = 0;
    this.invalid_token = invalid_token ? 1 : 0;
    this.refresh_token = refresh_token ? refresh_token : "";
    this.show_message = show_message;
    this.is_enc = false;
  }
}

export class MobileErr extends BaseMobileRes {
  constructor(
    message,
    messageType,
    error,
    { invalid_token, refresh_token, app_type, app_version, show_message }
  ) {
    super(invalid_token, refresh_token, app_type, app_version, show_message);
    this.status = false;
    this.message_type = messageType;
    this.message = message;
    this.data = {};
    this.error = error;
  }
}

export class MobileRes extends BaseMobileRes {
  constructor(
    message,
    data,
    { invalid_token, refresh_token, app_type, app_version, show_message }
  ) {
    super(invalid_token, refresh_token, app_type, app_version, show_message);
    this.status = true;
    this.message = message;
    this.message_type = "toast";
    this.data = data;
    this.error = {};
  }
}
