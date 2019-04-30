class HomeController < ApplicationController
  before_action :authenticate_user!, only: :user_home
  before_action :authenticate_ac!, only: :acs_home

  def abi
    data = File.read("public/Election.json")
    return render :json => data
  end

  def index
    return redirect_to users_home_path if current_user
    return redirect_to acs_home_path if current_ac
  end

  def user_home
    @orders = Order.where(user_id: current_user.id)
    @uns = UserNotification.where(user_id: current_user.id, read: false)
  end

  def acs_home
    @c_requests = Request.where(ac_id: current_ac.id, done: false)
    @payments = Payment.where(ac_id: current_ac.id, done: false)
  end

  def settle_payment
    payment = Payment.find_by(id: params['pay_id'])
    payment.update(done: true)
  end
end
