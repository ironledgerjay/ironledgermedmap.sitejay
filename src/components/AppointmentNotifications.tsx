import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  CheckCircle,
  Clock,
  Calendar,
  User,
  X,
  MarkAsRead,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { supabase } from '@/superbaseClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  type: 'appointment_confirmed' | 'appointment_cancelled' | 'appointment_reminder' | 'new_appointment';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: {
    appointmentId?: string;
    doctorName?: string;
    patientName?: string;
    appointmentTime?: string;
    appointmentDate?: string;
  };
}

interface AppointmentNotificationsProps {
  userRole?: 'doctor' | 'patient' | 'admin';
  userId?: string;
}

const AppointmentNotifications = ({ userRole = 'patient', userId }: AppointmentNotificationsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const currentUserId = userId || user?.id || 'demo-user';

  useEffect(() => {
    loadNotifications();
    setupRealTimeSubscriptions();

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      // Cleanup subscriptions
      supabase.removeAllChannels();
    };
  }, [currentUserId, userRole]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        // Use sample notifications if table doesn't exist
        const sampleNotifications: Notification[] = [
          {
            id: '1',
            type: 'appointment_confirmed',
            title: 'Appointment Confirmed',
            message: 'Your appointment with Dr. Sarah Johnson has been confirmed for tomorrow at 10:00 AM.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false,
            data: {
              appointmentId: 'apt-1',
              doctorName: 'Dr. Sarah Johnson',
              appointmentTime: '10:00 AM',
              appointmentDate: new Date().toISOString().split('T')[0]
            }
          },
          {
            id: '2',
            type: 'appointment_reminder',
            title: 'Appointment Reminder',
            message: 'Don\'t forget about your appointment tomorrow at 2:00 PM with Dr. Michael Chen.',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: false,
            data: {
              appointmentId: 'apt-2',
              doctorName: 'Dr. Michael Chen',
              appointmentTime: '2:00 PM',
              appointmentDate: new Date().toISOString().split('T')[0]
            }
          },
          {
            id: '3',
            type: 'new_appointment',
            title: 'New Appointment Request',
            message: userRole === 'doctor' ? 'New appointment request from John Doe for next week.' : 'Your appointment request has been submitted.',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            read: true,
            data: {
              appointmentId: 'apt-3',
              patientName: 'John Doe',
              appointmentTime: '3:00 PM',
              appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
            }
          }
        ];
        setNotifications(sampleNotifications);
        setUnreadCount(sampleNotifications.filter(n => !n.read).length);
      } else {
        const transformedNotifications = (data || []).map(notif => ({
          id: notif.id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          timestamp: notif.created_at,
          read: notif.read,
          data: notif.data
        }));
        setNotifications(transformedNotifications);
        setUnreadCount(transformedNotifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeSubscriptions = () => {
    // Subscribe to appointment changes
    const appointmentChannel = supabase
      .channel('appointment_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: userRole === 'doctor' ? `doctor_id=eq.${currentUserId}` : `patient_id=eq.${currentUserId}`
      }, handleAppointmentChange)
      .subscribe();

    // Subscribe to notification changes
    const notificationChannel = supabase
      .channel('notification_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${currentUserId}`
      }, handleNewNotification)
      .subscribe();

    return () => {
      appointmentChannel.unsubscribe();
      notificationChannel.unsubscribe();
    };
  };

  const handleAppointmentChange = (payload: any) => {
    console.log('Appointment change detected:', payload);
    
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    let notificationData: Partial<Notification> = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    if (eventType === 'INSERT') {
      notificationData = {
        ...notificationData,
        type: 'new_appointment',
        title: userRole === 'doctor' ? 'New Appointment Request' : 'Appointment Booked',
        message: userRole === 'doctor' 
          ? `New appointment request from ${newRecord.patient_name} for ${newRecord.appointment_date} at ${newRecord.appointment_time}.`
          : `Your appointment has been booked for ${newRecord.appointment_date} at ${newRecord.appointment_time}.`,
        data: {
          appointmentId: newRecord.id,
          doctorName: newRecord.doctor_name,
          patientName: newRecord.patient_name,
          appointmentTime: newRecord.appointment_time,
          appointmentDate: newRecord.appointment_date
        }
      };
    } else if (eventType === 'UPDATE') {
      if (oldRecord.status !== newRecord.status) {
        if (newRecord.status === 'confirmed') {
          notificationData = {
            ...notificationData,
            type: 'appointment_confirmed',
            title: 'Appointment Confirmed',
            message: `Your appointment with ${newRecord.doctor_name} has been confirmed for ${newRecord.appointment_date} at ${newRecord.appointment_time}.`,
            data: {
              appointmentId: newRecord.id,
              doctorName: newRecord.doctor_name,
              appointmentTime: newRecord.appointment_time,
              appointmentDate: newRecord.appointment_date
            }
          };
        } else if (newRecord.status === 'cancelled') {
          notificationData = {
            ...notificationData,
            type: 'appointment_cancelled',
            title: 'Appointment Cancelled',
            message: `Your appointment with ${newRecord.doctor_name} scheduled for ${newRecord.appointment_date} has been cancelled.`,
            data: {
              appointmentId: newRecord.id,
              doctorName: newRecord.doctor_name,
              appointmentTime: newRecord.appointment_time,
              appointmentDate: newRecord.appointment_date
            }
          };
        }
      }
    }

    if (notificationData.title) {
      addNotification(notificationData as Notification);
    }
  };

  const handleNewNotification = (payload: any) => {
    const newNotification = payload.new;
    addNotification({
      id: newNotification.id,
      type: newNotification.type,
      title: newNotification.title,
      message: newNotification.message,
      timestamp: newNotification.created_at,
      read: false,
      data: newNotification.data
    });
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      duration: 5000,
    });

    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }

    // Play sound if enabled
    if (soundEnabled) {
      playNotificationSound();
    }
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhTjUFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwIEhw=');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore autoplay restrictions
      });
    } catch (error) {
      // Ignore audio errors
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        // Update locally if database update fails
        setNotifications(prev => prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Update locally anyway
      setNotifications(prev => prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', currentUserId)
        .eq('read', false);

      if (error) {
        // Update locally if database update fails
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Update locally anyway
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment_confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'appointment_cancelled':
        return <X className="h-4 w-4 text-red-600" />;
      case 'appointment_reminder':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'new_appointment':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
        <span className="text-sm text-gray-600">Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-0"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-96 z-50 shadow-lg border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Disable sound' : 'Enable sound'}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{unreadCount} unread</span>
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <MarkAsRead className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length > 0 ? (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${
                        notification.read 
                          ? 'border-l-transparent bg-gray-50' 
                          : 'border-l-blue-500 bg-blue-50'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'} mt-1`}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No notifications yet</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppointmentNotifications;
