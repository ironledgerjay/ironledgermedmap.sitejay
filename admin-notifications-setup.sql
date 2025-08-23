-- =====================================================
-- Admin Notifications Table Setup
-- Missing table needed for real-time admin notifications
-- =====================================================

-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'doctor_application', 'user_registration', 'booking_created', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Extra data like doctorId, userId, etc.
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for admin-only access
CREATE POLICY "Admin users can manage notifications" ON public.admin_notifications
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.user_profiles WHERE role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_admin_notifications_updated_at 
  BEFORE UPDATE ON public.admin_notifications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some test notifications
INSERT INTO public.admin_notifications (type, title, message, data) VALUES
('system', 'Database Setup Complete', 'Admin notifications table has been created successfully', '{"status": "setup_complete"}'),
('info', 'Real-time Ready', 'Your admin dashboard is now ready for real-time updates', '{"feature": "real_time_subscriptions"}');
