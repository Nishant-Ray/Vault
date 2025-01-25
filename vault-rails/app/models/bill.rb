class Bill < ApplicationRecord
  belongs_to :user

  def to_s
    "(Bill #{self.id}: {Due Date: #{self.due_date}, Total: #{self.total}, Category: #{self.category}, Name: #{self.name}})"
  end
end
