class AddExecuteToRequest < ActiveRecord::Migration[5.1]
  def change
    add_column :requests, :is_execute, :boolean
  end
end
