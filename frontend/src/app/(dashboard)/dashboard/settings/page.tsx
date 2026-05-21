'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/shared/page-header';
import { useAuth } from '@/hooks/use-auth';
import { Settings, Bell, Shield, Globe, User } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account and preferences" />

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input defaultValue={user?.name} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={user?.email} type="email" />
              </div>
            </div>
            <Button variant="gradient">Save Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how you receive updates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><Label>New leads</Label><p className="text-sm text-muted-foreground">When a new lead is captured</p></div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><Label>Conversation updates</Label><p className="text-sm text-muted-foreground">When conversations are updated</p></div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><Label>Weekly digest</Label><p className="text-sm text-muted-foreground">Weekly performance summary</p></div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Organization</CardTitle>
                <CardDescription>Manage your team and workspace</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input defaultValue="Acme Corp" />
            </div>
            <Button variant="gradient">Save</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
