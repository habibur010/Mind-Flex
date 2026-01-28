import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Shield, Bell, Palette, Camera, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    bio: "Focused on progress, one small step at a time.",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simulate API update
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-display text-primary">Your Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your personalized ADHD toolkit settings.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="space-y-8">
          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white dark:bg-slate-900">
            <div className="h-32 bg-gradient-to-r from-primary to-accent relative">
              <div className="absolute -bottom-16 left-8">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-slate-900 shadow-xl">
                    <AvatarImage src={user?.profilePicture || ""} />
                    <AvatarFallback className="bg-slate-100 text-primary text-4xl font-bold">
                      {user?.firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" className="absolute bottom-0 right-0 rounded-full w-10 h-10 shadow-lg group-hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="pt-20 p-8 space-y-4">
              <div>
                <h2 className="text-2xl font-bold font-display">{user?.firstName} {user?.lastName}</h2>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" /> {user?.email}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-slate-500 italic">
                "{formData.bio}"
              </p>
              <div className="flex gap-2 pt-2">
                <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Explorer</span>
                <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Level 4</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                   <Bell className="w-4 h-4 text-slate-400" />
                   <span className="text-sm font-medium">Notifications</span>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                   <Palette className="w-4 h-4 text-slate-400" />
                   <span className="text-sm font-medium">Dyslexia Font</span>
                </div>
                <div className="w-10 h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        <Card className="lg:col-span-2 border-none shadow-xl rounded-[3rem] bg-white dark:bg-slate-900">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-2xl font-bold font-display flex items-center gap-3">
              <User className="w-6 h-6 text-primary" /> Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-bold ml-1">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-bold ml-1">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold ml-1">Email Address</Label>
                <Input 
                  id="email" 
                  value={formData.email}
                  disabled
                  className="rounded-2xl h-12 bg-slate-100 dark:bg-slate-800/50 border-none opacity-60"
                />
                <p className="text-[10px] text-muted-foreground ml-1">Email managed by Replit Auth</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="font-bold ml-1">About Me</Label>
                <textarea 
                  id="bio" 
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="w-full min-h-[120px] rounded-3xl p-4 bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-primary focus-visible:outline-none resize-none text-sm"
                  placeholder="Tell us about your journey..."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isUpdating}
                  className="rounded-2xl h-14 px-12 text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
                >
                  {isUpdating ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Updating...</>
                  ) : (
                    <><Save className="w-5 h-5 mr-2" /> Save Changes</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
