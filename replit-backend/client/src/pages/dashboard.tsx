import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, HardDrive, Upload, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Analytics } from "@shared/schema";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="p-6 lg:p-12 space-y-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your file management activity
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Files"
          value={analytics?.totalFiles || 0}
          icon={FileText}
          description={`${analytics?.filesThisMonth || 0} uploaded this month`}
        />
        <StatCard
          title="Storage Used"
          value={formatBytes(analytics?.totalStorage || 0)}
          icon={HardDrive}
          description={`${formatBytes(analytics?.storageThisMonth || 0)} this month`}
        />
        <StatCard
          title="Recent Uploads"
          value={analytics?.recentUploads?.length || 0}
          icon={Upload}
          description="Last 7 days"
        />
        <StatCard
          title="Growth"
          value={`${Math.round((analytics?.filesThisMonth || 0) / Math.max(analytics?.totalFiles || 1, 1) * 100)}%`}
          icon={TrendingUp}
          description="Files added this month"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.recentUploads && analytics.recentUploads.length > 0 ? (
              <div className="space-y-3">
                {analytics.recentUploads.map((upload, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover-elevate"
                    data-testid={`recent-upload-${idx}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate font-mono">
                        {upload.filename}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(upload.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm font-mono text-muted-foreground ml-4">
                      {formatBytes(upload.fileSize)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Upload className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent uploads</p>
                <p className="text-sm">Upload your first file to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">File Types</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.fileTypeDistribution && analytics.fileTypeDistribution.length > 0 ? (
              <div className="space-y-3">
                {analytics.fileTypeDistribution.map((type, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                    data-testid={`file-type-${idx}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium">{type.type}</span>
                    </div>
                    <span className="text-sm font-mono font-bold">{type.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No file types to display</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
