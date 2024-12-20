module RackSessionsFix # creates a fake session hash (because API-only rails projects have sessions disabled)
    extend ActiveSupport::Concern
    class FakeRackSession < Hash
      def enabled?
        false
      end
      def destroy; end
    end
    included do
      before_action :set_fake_session
      private
      def set_fake_session
        request.env['rack.session'] ||= FakeRackSession.new
      end
    end
  end