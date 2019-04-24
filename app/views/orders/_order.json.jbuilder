json.extract! order, :id, :user_id, :ac_id, :seat, :date, :arrival, :departure, :created_at, :updated_at
json.url order_url(order, format: :json)
