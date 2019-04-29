class AddReadToUserNotification < ActiveRecord::Migration[5.1]
  def change
    add_column :user_notifications, :read, :boolean
  end
end
