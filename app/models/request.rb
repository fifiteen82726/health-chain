class Request < ApplicationRecord
  belongs_to :user
  belongs_to :order
  belongs_to :ac
  has_one :user_notification
end
