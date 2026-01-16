import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Users, Shield, LogsIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { ActivityLogsTab } from "@/components/ActivityLogsTab";
import { NotificationsTab } from "@/components/NotificationsTab";

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const { data: submissions, refetch } = trpc.support.getAllSubmissions.useQuery();
  const { data: allUsers, refetch: refetchUsers } = trpc.users.getAllUsers.useQuery();
  const updateStatus = trpc.support.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const updateUserRole = trpc.users.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("User role updated successfully");
      refetchUsers();
    },
    onError: () => {
      toast.error("Failed to update user role");
    },
  });

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"submissions" | "users" | "logs" | "notifications">("submissions");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">You must be logged in to access the admin dashboard.</p>
            <Link href="/">
              <Button>Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleStatusUpdate = (id: number, status: "accepted" | "denied") => {
    updateStatus.mutate({ id, status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" />Accepted</Badge>;
      case "denied":
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="w-3 h-3 mr-1" />Denied</Badge>;
      default:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Riverside Primary School" className="h-10 w-10" />
              <span className="font-bold text-lg text-foreground">Admin Dashboard</span>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage support submissions and user roles</p>
          
          {/* Tabs */}
          <div className="flex gap-4 mt-6">
            <Button
              variant={activeTab === "submissions" ? "default" : "outline"}
              onClick={() => setActiveTab("submissions")}
            >
              <Clock className="w-4 h-4 mr-2" />
              Support Submissions
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "outline"}
              onClick={() => setActiveTab("users")}
            >
              <Users className="w-4 h-4 mr-2" />
              User Management
            </Button>
            <Button
              variant={activeTab === "logs" ? "default" : "outline"}
              onClick={() => setActiveTab("logs")}
            >
              <LogsIcon className="w-4 h-4 mr-2" />
              Activity Logs
            </Button>
            <Button
              variant={activeTab === "notifications" ? "default" : "outline"}
              onClick={() => setActiveTab("notifications")}
            >
              <Clock className="w-4 h-4 mr-2" />
              Notifications
            </Button>
          </div>
        </div>

        {/* Support Submissions Tab */}
        {activeTab === "submissions" && (
          <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-foreground">
                    {submissions?.filter(s => s.status === "pending").length || 0}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Accepted</p>
                  <p className="text-3xl font-bold text-green-500">
                    {submissions?.filter(s => s.status === "accepted").length || 0}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Denied</p>
                  <p className="text-3xl font-bold text-red-500">
                    {submissions?.filter(s => s.status === "denied").length || 0}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {submissions && submissions.length > 0 ? (
            submissions.map((submission) => (
              <Card 
                key={submission.id} 
                className={`transition-all ${
                  submission.status === "accepted" 
                    ? "border-green-500 bg-green-500/5" 
                    : submission.status === "denied" 
                    ? "border-red-500 bg-red-500/5" 
                    : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className={submission.status === "denied" ? "line-through text-muted-foreground" : ""}>
                          {submission.category} - {submission.subCategory}
                        </CardTitle>
                        {getStatusBadge(submission.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Submitted: {new Date(submission.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                    >
                      {expandedId === submission.id ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </div>
                </CardHeader>

                {expandedId === submission.id && (
                  <CardContent className="space-y-4">
                    {submission.category === "Appeal" && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">Appeal Type</p>
                            <p className="text-sm text-muted-foreground">{submission.appealType}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">User or Group</p>
                            <p className="text-sm text-muted-foreground">{submission.userOrGroup}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Email</p>
                            <p className="text-sm text-muted-foreground">{submission.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Roblox Username</p>
                            <p className="text-sm text-muted-foreground">{submission.robloxUsername}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Ban Reason</p>
                          <p className="text-sm text-muted-foreground">{submission.banReason}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Appeal Reason</p>
                          <p className="text-sm text-muted-foreground">{submission.appealReason}</p>
                        </div>
                      </>
                    )}
                    {submission.message && (
                      <div>
                        <p className="text-sm font-semibold text-foreground">Message</p>
                        <p className="text-sm text-muted-foreground">{submission.message}</p>
                      </div>
                    )}

                    {submission.status === "pending" && (
                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          onClick={() => handleStatusUpdate(submission.id, "accepted")}
                          className="bg-green-500 hover:bg-green-600"
                          disabled={updateStatus.isPending}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate(submission.id, "denied")}
                          variant="destructive"
                          disabled={updateStatus.isPending}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Deny
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No submissions yet</p>
              </CardContent>
            </Card>
           )}
        </div>
          </>
        )}

        {/* User Management Tab */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                {allUsers && allUsers.length > 0 ? (
                  <div className="space-y-3">
                    {allUsers.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name || "User"} className="w-12 h-12 rounded-full" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                              <Users className="w-6 h-6 text-primary" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-foreground">{u.name || "Unknown User"}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {u.role === "admin" ? (
                            <Badge className="bg-primary">
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </Badge>
                          ) : (
                            <Badge variant="outline">User</Badge>
                          )}
                          {u.id !== user?.id && (
                            <Button
                              size="sm"
                              variant={u.role === "admin" ? "outline" : "default"}
                              onClick={() => updateUserRole.mutate({
                                userId: u.id,
                                role: u.role === "admin" ? "user" : "admin",
                              })}
                              disabled={updateUserRole.isPending}
                            >
                              {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No users found</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Activity Logs Tab */}
        {activeTab === "logs" && (
          <ActivityLogsTab />
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <NotificationsTab />
        )}
      </div>
    </div>
  );
}
