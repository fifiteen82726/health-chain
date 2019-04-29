class CreatePayments < ActiveRecord::Migration[5.1]
  def change
    create_table :payments do |t|
      t.integer :ac_id
      t.string :to
      t.float :amount

      t.timestamps
    end
  end
end
