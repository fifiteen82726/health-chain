class Order < ApplicationRecord
  belongs_to :user
  belongs_to :ac
  has_many :requests, dependent: :destroy
end
