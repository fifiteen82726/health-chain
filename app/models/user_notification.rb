class UserNotification < ApplicationRecord
  belongs_to :user
  belongs_to :order
  belongs_to :request
end
