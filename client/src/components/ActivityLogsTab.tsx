import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export function ActivityLogsTab() {
  const { data: logs, isLoading } = trpc.logs.getAllLogs.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin mr-2" />
        Loading activity logs...
      </div>
    );
  }

  const getActionColor = (action: string) => {
    if (action.includes('accepted')) return 'bg-green-100 text-green-800';
    if (action.includes('denied')) return 'bg-red-100 text-red-800';
    if (action.includes('role')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'submission_accepted': 'Submission Accepted',
      'submission_denied': 'Submission Denied',
      'user_role_changed': 'Role Changed',
    };
    return labels[action] || action;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Activity Logs</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Track all admin actions and changes
        </p>
      </div>

      {!logs || logs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No activity logs yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <Card key={log.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getActionColor(log.action)}>
                        {getActionLabel(log.action)}
                      </Badge>
                      <span className="text-sm font-medium">{log.adminName}</span>
                    </div>
                    <p className="text-sm text-foreground mb-1">
                      {log.description}
                    </p>
                    {log.targetName && (
                      <p className="text-xs text-muted-foreground">
                        Target: {log.targetName}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(log.createdAt), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(log.createdAt), 'HH:mm:ss')}
                    </p>
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
