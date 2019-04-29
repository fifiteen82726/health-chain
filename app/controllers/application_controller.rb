class ApplicationController < ActionController::Base
  # protect_from_forgery with: :exception
  def error(code='', message='')
    render json: { status: 'error', data: { code: code, message: message }}
    false
  end

  def ok(info={})
    render json: { status: 'ok', data: info }
    true
  end
end
