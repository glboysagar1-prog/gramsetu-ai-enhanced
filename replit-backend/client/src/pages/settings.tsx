import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { User, Bell, Shield, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";
  const userId = localStorage.getItem("userId") || "N/A";

  return (
    <div className="p-6 lg:p-12 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Email Address</Label>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{userEmail}</p>
            </div>
            <div className="grid gap-2">
              <Label>User ID</Label>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{userId}</p>
            </div>
            <div className="grid gap-2">
              <Label>Plan</Label>
              <p className="text-sm font-medium">Free Plan</p>
              <p className="text-xs text-muted-foreground">
                Upgrade to Pro for unlimited storage and advanced features
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Password</Label>
              <p className="text-sm text-muted-foreground">
                Your password is securely encrypted
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>API Authentication</Label>
              <p className="text-sm text-muted-foreground">
                All API requests are authenticated with JWT tokens
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About
            </CardTitle>
            <CardDescription>Application information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <strong>Version:</strong> 1.0.0
            </p>
            <p className="text-sm">
              <strong>Backend:</strong> Node.js + Express + PostgreSQL
            </p>
            <p className="text-sm">
              <strong>Frontend:</strong> React + TypeScript + Tailwind CSS
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              GramSetu AI - Professional file management platform with analytics
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
