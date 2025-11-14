import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Analytics } from "@shared/schema";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="p-6 lg:p-12 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...(analytics?.uploadTrend?.map(d => d.count) || [1]));

  return (
    <div className="p-6 lg:p-12 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Insights and trends for your file management
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Files
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono" data-testid="metric-total-files">
              {analytics?.totalFiles || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              {analytics?.filesThisMonth || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Storage Used
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono" data-testid="metric-storage-used">
              {formatBytes(analytics?.totalStorage || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatBytes(analytics?.storageThisMonth || 0)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              File Types
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono" data-testid="metric-file-types">
              {analytics?.fileTypeDistribution?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Different formats
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg File Size
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono" data-testid="metric-avg-size">
              {formatBytes(
                analytics?.totalFiles 
                  ? Math.round((analytics?.totalStorage || 0) / analytics.totalFiles)
                  : 0
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per file
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Upload Trend
            </CardTitle>
            <CardDescription>Files uploaded over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.uploadTrend && analytics.uploadTrend.length > 0 ? (
              <div className="space-y-2">
                {analytics.uploadTrend.map((data, idx) => (
                  <div key={idx} className="flex items-center gap-4" data-testid={`trend-${idx}`}>
                    <div className="w-20 text-sm font-medium text-muted-foreground">
                      {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1">
                      <div 
                        className="h-8 bg-primary rounded-md flex items-center justify-end px-2 transition-all"
                        style={{ width: `${(data.count / maxCount) * 100}%`, minWidth: '2rem' }}
                      >
                        <span className="text-xs font-bold text-primary-foreground">
                          {data.count}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No trend data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              File Type Distribution
            </CardTitle>
            <CardDescription>Breakdown by file format</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.fileTypeDistribution && analytics.fileTypeDistribution.length > 0 ? (
              <div className="space-y-4">
                {analytics.fileTypeDistribution.map((type, idx) => {
                  const percentage = Math.round((type.count / (analytics.totalFiles || 1)) * 100);
                  return (
                    <div key={idx} className="space-y-2" data-testid={`distribution-${idx}`}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{type.type}</span>
                        <span className="font-mono font-bold text-muted-foreground">
                          {type.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No distribution data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Uploads
          </CardTitle>
          <CardDescription>Latest files added to your storage</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics?.recentUploads && analytics.recentUploads.length > 0 ? (
            <div className="space-y-2">
              {analytics.recentUploads.map((upload, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover-elevate"
                  data-testid={`recent-${idx}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate font-mono">
                      {upload.filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(upload.uploadedAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="text-sm font-mono font-medium text-muted-foreground ml-4">
                    {formatBytes(upload.fileSize)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent uploads</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
