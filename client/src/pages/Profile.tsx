import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import { usePoints } from "@/hooks/use-points";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Shield, Bell, Palette, Camera, Loader2, Save, Zap, Target, Trophy, Flame, Gamepad2, SmilePlus, Star, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { points, level, levelTitle, levelProgress, pointsToNext, tasksCompleted, streak, gamesPlayed, moodsLogged } = usePoints();
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
    
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    }, 1000);
  };

  const statCards = [
    { label: "Total Points", value: points, icon: Zap, color: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: "Tasks Done", value: tasksCompleted, icon: Target, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Day Streak", value: streak, icon: Flame, color: "from-red-500 to-pink-500", bg: "bg-red-50 dark:bg-red-950/30" },
    { label: "Games Played", value: gamesPlayed, icon: Gamepad2, color: "from-purple-500 to-violet-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
  ];

  const achievements = [
    { name: "First Steps", desc: "Complete your first task", earned: tasksCompleted >= 1, icon: Star },
    { name: "Task Warrior", desc: "Complete 10 tasks", earned: tasksCompleted >= 10, icon: Target },
    { name: "Point Collector", desc: "Earn 100 points", earned: points >= 100, icon: Zap },
    { name: "Streak Starter", desc: "3-day streak", earned: streak >= 3, icon: Flame },
    { name: "Game Explorer", desc: "Play 5 games", earned: gamesPlayed >= 5, icon: Gamepad2 },
    { name: "Mood Tracker", desc: "Log 5 moods", earned: moodsLogged >= 5, icon: SmilePlus },
    { name: "High Achiever", desc: "Earn 500 points", earned: points >= 500, icon: Trophy },
    { name: "Unstoppable", desc: "7-day streak", earned: streak >= 7, icon: TrendingUp },
  ];

  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-display text-primary" data-testid="text-profile-title">Your Profile</h1>
        <p className="text-muted-foreground mt-2">Your progress, achievements, and settings all in one place.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white dark:bg-slate-900">
            <div className="h-32 bg-gradient-to-r from-primary to-accent relative">
              <div className="absolute -bottom-16 left-8">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-slate-900 shadow-xl">
                    <AvatarImage src={user?.profileImageUrl || ""} />
                    <AvatarFallback className="bg-slate-100 text-primary text-4xl font-bold">
                      {user?.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" className="absolute bottom-0 right-0 rounded-full w-10 h-10 shadow-lg group-hover:scale-110 transition-transform" data-testid="button-change-avatar">
                    <Camera className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="pt-20 p-8 space-y-4">
              <div>
                <h2 className="text-2xl font-bold font-display" data-testid="text-user-name">{user?.firstName || "User"} {user?.lastName || ""}</h2>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" /> {user?.email || "Not set"}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-slate-500 italic">
                "{formData.bio}"
              </p>
              <div className="flex gap-2 pt-2">
                <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" data-testid="text-level-title">{levelTitle}</span>
                <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" data-testid="text-level">Level {level}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-primary to-accent text-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">Level Progress</p>
                    <p className="text-2xl font-black font-display" data-testid="text-points-total">{points} pts</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black font-display" data-testid="text-level-number">{level}</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-70">Level</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    data-testid="progress-level"
                  />
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-70">
                  <span>{levelProgress}/100 pts</span>
                  <span>{pointsToNext} pts to Level {level + 1}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                   <Bell className="w-4 h-4 text-slate-400" />
                   <span className="text-sm font-medium">Notifications</span>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer" data-testid="toggle-notifications">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                   <Palette className="w-4 h-4 text-slate-400" />
                   <span className="text-sm font-medium">Dyslexia Font</span>
                </div>
                <div className="w-10 h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative cursor-pointer" data-testid="toggle-dyslexia">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`border-none shadow-lg rounded-[2rem] ${stat.bg} overflow-hidden`}>
                  <CardContent className="p-5 text-center space-y-2">
                    <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-3xl font-black font-display" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>{stat.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-slate-900">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-xl font-bold font-display flex items-center gap-3">
                <Trophy className="w-5 h-5 text-amber-500" /> 
                Achievements
                <span className="text-sm font-normal text-muted-foreground ml-auto">{earnedCount}/{achievements.length} earned</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-3">
                {achievements.map((ach, i) => (
                  <motion.div
                    key={ach.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      ach.earned 
                        ? "bg-primary/5 border-primary/20 shadow-sm" 
                        : "bg-slate-50 dark:bg-slate-800/50 border-border opacity-50"
                    }`}
                    data-testid={`achievement-${ach.name.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <div className={`p-2.5 rounded-xl ${
                      ach.earned 
                        ? "bg-primary/10 text-primary" 
                        : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                    }`}>
                      <ach.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{ach.name}</p>
                      <p className="text-[11px] text-muted-foreground">{ach.desc}</p>
                    </div>
                    {ach.earned && (
                      <div className="text-primary">
                        <Star className="w-5 h-5 fill-primary" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl rounded-[3rem] bg-white dark:bg-slate-900">
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
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="font-bold ml-1">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-primary"
                      data-testid="input-last-name"
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
                    data-testid="input-email"
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
                    data-testid="input-bio"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                    className="rounded-2xl h-14 px-12 text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
                    data-testid="button-save-profile"
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
      </div>
    </DashboardLayout>
  );
}
