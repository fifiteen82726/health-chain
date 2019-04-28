class Request < ApplicationRecord
  belongs_to :user
  belongs_to :order
  belongs_to :ac
end
