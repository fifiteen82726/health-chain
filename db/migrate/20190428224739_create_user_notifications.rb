class CreateUserNotifications < ActiveRecord::Migration[5.1]
  def change
    create_table :user_notifications do |t|
      t.integer :user_id
      t.boolean :isExecute
      t.integer :order_id
      t.integer :request_id

      t.timestamps
    end
  end
end
