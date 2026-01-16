import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2, Bell, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function NotificationsTab() {
  const { data: notifications, isLoading, refetch } = trpc.notifications.getUnreadNotifications.useQuery();
  const markAsRead = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Notification marked as read");
    },
  });
  
  const markAllAsRead = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("All notifications marked as read");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin mr-2" />
        Loading notifications...
      </div>
    );
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_submission':
        return 'bg-blue-100 text-blue-800';
      case 'submission_status_change':
        return 'bg-green-100 text-green-800';
      case 'user_action':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationLabel = (type: string) => {
    const labels: Record<string, string> = {
      'new_submission': 'New Submission',
      'submission_status_change': 'Status Changed',
      'user_action': 'User Action',
      'system': 'System',
    };
    return labels[type] || type;
  };

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            <Check size={16} className="mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {!notifications || notifications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-center text-muted-foreground">No notifications yet</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`hover:shadow-md transition-all ${
                !notification.isRead ? 'border-primary/50 bg-primary/5' : ''
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getNotificationColor(notification.type)}>
                        {getNotificationLabel(notification.type)}
                      </Badge>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {notification.title}
                    </h4>
                    {notification.message && (
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(notification.createdAt), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(notification.createdAt), 'HH:mm:ss')}
                    </p>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead.mutate({ notificationId: notification.id })}
                        disabled={markAsRead.isPending}
                        className="mt-2"
                      >
                        <Check size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
