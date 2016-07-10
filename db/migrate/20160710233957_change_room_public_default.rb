class ChangeRoomPublicDefault < ActiveRecord::Migration
  def up
    change_column_default :rooms, :public, false
  end

  def down
    change_column_default :rooms, :public, nil
  end
end
