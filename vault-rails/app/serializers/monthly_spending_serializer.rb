class MonthlySpendingSerializer
  include JSONAPI::Serializer
  attributes :id, :user_id, :month, :total
end
