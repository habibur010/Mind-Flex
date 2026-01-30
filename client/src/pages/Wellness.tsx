import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Play, Camera, RefreshCcw, Brain, Droplets, Moon, Coffee, Heart, Sun, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

import yogaTree from "@assets/tree_pose_1769782220563.avif";
import yogaWarrior from "@assets/Warrior_Poses_1769782220564.jpg";
import yogaChild from "@assets/Child_pose_Balasana_1769782220562.jpg";
import yogaCatCow from "@assets/cat-cow_1769782220561.jpg";
import yogaForwardBend from "@assets/Seated-Forward-Bend_1769782220563.jpg";
import yogaBreathing from "@assets/Alternate_Nostril_Breathing_1769782220561.jpg";

const YOGA_POSES = [
  {
    title: "Tree Pose (Vrikshasana)",
    benefits: "Improves balance & concentration",
    info: "Focus on a fixed point to train attention",
    description: "Stand on one leg, placing the sole of your other foot on your inner thigh or calf. Bring hands to prayer position.",
    image: yogaTree
  },
  {
    title: "Warrior Pose (Virabhadrasana)",
    benefits: "Builds strength & focus",
    info: "Helps channel excess energy",
    description: "Step one foot back, bend front knee at 90 degrees, and reach arms wide. Keep your gaze over the front hand.",
    image: yogaWarrior
  },
  {
    title: "Child’s Pose (Balasana)",
    benefits: "Calms the nervous system",
    info: "Good for relaxation and grounding",
    description: "Kneel on the floor, sit on your heels, and fold forward, resting your forehead on the mat and arms by your sides.",
    image: yogaChild
  },
  {
    title: "Cat-Cow (Marjaryasana-Bitilasana)",
    benefits: "Enhances body awareness",
    info: "Synchronizes breath with movement",
    description: "On all fours, arch your back (Cow) while inhaling, and round your spine (Cat) while exhaling.",
    image: yogaCatCow
  },
  {
    title: "Seated Forward Bend (Paschimottanasana)",
    benefits: "Reduces anxiety",
    info: "Encourages stillness and patience",
    description: "Sit with legs extended, reach for your feet while keeping your spine long, and fold gently over your legs.",
    image: yogaForwardBend
  },
  {
    title: "Alternate Nostril Breathing (Nadi Shodhana)",
    benefits: "Balances brain hemispheres",
    info: "Excellent for calming impulsivity",
    description: "Use your thumb and ring finger to alternately close each nostril while breathing deeply and slowly.",
    image: yogaBreathing
  }
];

export default function Wellness() {
  const [selectedPose, setSelectedPose] = useState<typeof YOGA_POSES[0] | null>(null);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-primary">Wellness & Yoga</h1>
        <p className="text-muted-foreground mt-2">Mindful movement designed for ADHD focus and relaxation.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Yoga Poses Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {YOGA_POSES.map((pose, i) => (
              <Card 
                key={i} 
                className="overflow-hidden border-none bg-card hover-elevate transition-all cursor-pointer group"
                onClick={() => setSelectedPose(pose)}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={pose.image} alt={pose.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-xs font-medium">{pose.benefits}</p>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{pose.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{pose.info}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pose Detail or Sidebar Info */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {selectedPose ? (
              <motion.div
                key={selectedPose.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900">
                  <div className="aspect-[3/4] max-h-[400px] relative">
                    <img src={selectedPose.image} alt={selectedPose.title} className="w-full h-full object-contain bg-slate-100 dark:bg-slate-800" />
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="absolute top-4 right-4 rounded-full"
                      onClick={() => setSelectedPose(null)}
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold font-display mb-2">{selectedPose.title}</h2>
                      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Heart className="w-3 h-3" /> {selectedPose.benefits}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">How to do it</h4>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{selectedPose.description}</p>
                      </div>
                      
                      <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                        <div className="flex gap-3">
                          <Info className="w-5 h-5 text-primary shrink-0" />
                          <p className="text-xs font-bold leading-normal italic text-slate-500">{selectedPose.info}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full rounded-2xl h-12 font-bold" onClick={() => setSelectedPose(null)}>
                      Close Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-8">
                <Card className="border-none shadow-xl bg-gradient-to-br from-primary to-accent rounded-[2.5rem] overflow-hidden text-white p-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                        <Brain className="w-5 h-5" />
                      </div>
                      Mindful Nutrition
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20">
                      <p className="text-sm font-bold mb-1">Omega-3 Rich</p>
                      <p className="text-xs opacity-70">Salmon, Walnuts, Chia seeds.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20">
                      <p className="text-sm font-bold mb-1">High Protein</p>
                      <p className="text-xs opacity-70">Eggs, chicken, turkey, lentils.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20">
                      <p className="text-sm font-bold mb-1">Complex Carbs</p>
                      <p className="text-xs opacity-70">Whole Grains, Sweet Potatoes.</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-muted/50 p-6 rounded-[2rem] border border-border">
                  <h3 className="font-bold mb-2">Yoga for ADHD</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Yoga helps synchronize the breath with movement, which can significantly improve body awareness and emotional regulation for neurodiverse individuals.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}