class AddDoneToPayment < ActiveRecord::Migration[5.1]
  def change
    add_column :payments, :done, :boolean, default: false
  end
end
