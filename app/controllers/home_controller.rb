class HomeController < ApplicationController
  before_action :authenticate_user!, only: :user_home
  before_action :authenticate_ac!, only: :acs_home

  def index
    return redirect_to users_home_path if current_user
    return redirect_to acs_home_path if current_ac
  end

  def user_home
    @orders = Order.where(user_id: current_user.id)
  end

  def acs_home

  end
end