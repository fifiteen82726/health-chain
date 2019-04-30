Rails.application.routes.draw do
  resources :orders do
    post :confirm
    post :transfer
    post :reject
  end
  devise_for :acs
  devise_for :users
  root 'home#index'
  get 'users_home' => 'home#user_home'
  get 'acs_home' => 'home#acs_home'
  get 'abi' => 'home#abi'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
