class CreateRequests < ActiveRecord::Migration[5.1]
  def change
    create_table :requests do |t|
      t.integer :user_id
      t.integer :ac_id
      t.string :seat
      t.datetime :date
      t.string :arrival
      t.string :departure
      t.string :order_id
      t.string :integer

      t.timestamps
    end
  end
end
