class AddDoneToRequest < ActiveRecord::Migration[5.1]
  def change
    add_column :requests, :done, :boolean, default: false
  end
end
