import { Link } from "wouter";
import { ArrowRight, Brain, Zap, Heart, Check, AlertCircle, Lightbulb, Users, Clock, Smile } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="p-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full sticky top-0 z-40 bg-gradient-to-b from-blue-50 to-blue-50/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold font-display text-foreground">MindFlex</span>
        </div>
        <Link href="/login" className="px-6 py-2.5 rounded-full bg-white text-foreground font-semibold shadow-sm hover:shadow-md transition-all">
          Sign In
        </Link>
      </header>

      {/* Hero */}
      <section className="py-4 md:py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground leading-[1.1]">
              Master your mind,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                find your focus.
              </span>
            </h1>
            <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
              MindFlex is designed specifically for ADHD brains. Manage tasks, track your mood, build focus with gamification, and get support when you need it—all in one compassionate space.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/register" className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2" data-testid="button-get-started">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="px-6 py-3 rounded-full border-2 border-blue-600 text-blue-600 font-bold text-base hover:bg-blue-50 transition-all">
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=1000"
              alt="MindFlex Abstract Art"
              className="rounded-[2rem] shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700 max-h-96 w-full object-cover"
            />
            
            <div className="absolute -left-8 top-10 bg-white p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
              <Zap className="w-6 h-6 text-yellow-500 mb-1" />
              <p className="font-bold text-xs">Focus Streak</p>
              <p className="text-lg font-display text-blue-600">5 Days!</p>
            </div>

            <div className="absolute -right-6 bottom-10 bg-white p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }}>
              <Heart className="w-6 h-6 text-red-500 mb-1" />
              <p className="font-bold text-xs">Mood</p>
              <p className="text-lg font-display text-green-600">Great!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Understanding ADHD Section */}
      <section className="pt-10 pb-10 md:pt-14 md:pb-14 px-6 md:px-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold font-display">What is ADHD?</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              ADHD (Attention-Deficit/Hyperactivity Disorder) affects how the brain manages attention, impulse control, and activity levels.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Common Signs */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <AlertCircle className="w-9 h-9 text-blue-600 mb-3" />
              <h3 className="text-xl font-bold font-display mb-3">Common Signs</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Difficulty focusing on tasks</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Trouble with time management</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Hyperfocus on interesting tasks</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Impulsivity and restlessness</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Difficulty organizing tasks</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Emotional sensitivity</span>
                </li>
              </ul>
            </div>

            {/* How It's Detected */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
              <Lightbulb className="w-9 h-9 text-purple-600 mb-3" />
              <h3 className="text-xl font-bold font-display mb-3">How It's Detected</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Clinical evaluation by specialists</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Behavioral and cognitive assessments</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Medical and family history review</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>IQ and learning tests</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Mood and emotional tracking</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Real-life behavior observation</span>
                </li>
              </ul>
            </div>

            {/* ADHD Strengths */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
              <Smile className="w-9 h-9 text-green-600 mb-3" />
              <h3 className="text-xl font-bold font-display mb-3">ADHD Strengths</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Creative thinking and innovation</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>High energy and enthusiasm</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Hyperfocus superpowers</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Quick problem-solving ability</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Empathy and sensitivity</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Adaptability and resilience</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 md:py-14 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold font-display">Powerful Features Built for ADHD</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Every tool is designed with ADHD brains in mind to reduce cognitive load and maximize support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-6 border border-blue-200">
              <Clock className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-bold font-display mb-2">Focus Timer (Combat Time Blindness)</h3>
              <p className="text-sm text-muted-foreground mb-3">Pomodoro-style timer with visual countdown to help you stay aware of time while working. Includes customizable work/break durations and audio alerts.</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Visual countdown display</li>
                <li>✓ Customizable sessions</li>
                <li>✓ Audio notifications</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-6 border border-purple-200">
              <Check className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-bold font-display mb-2">Task Management</h3>
              <p className="text-sm text-muted-foreground mb-3">Daily rotating tasks designed for quick wins and momentum building. Create personal tasks and track completion with points and badges.</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Pre-built daily tasks</li>
                <li>✓ Personal task lists</li>
                <li>✓ Gamified rewards</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl p-6 border border-green-200">
              <Brain className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-lg font-bold font-display mb-2">Brain Gym Games</h3>
              <p className="text-sm text-muted-foreground mb-3">Mini-games like Reaction Tapper, Memory Match, and Sudoku to build focus and redirect energy productively.</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Reaction speed training</li>
                <li>✓ Memory exercises</li>
                <li>✓ Quick puzzles</li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl p-6 border border-pink-200">
              <Heart className="w-8 h-8 text-pink-600 mb-3" />
              <h3 className="text-lg font-bold font-display mb-2">Mood & Emotion Tracking</h3>
              <p className="text-sm text-muted-foreground mb-3">Log your daily mood with emoji-based tracking. AI-powered face analysis detects emotions and suggests personalized wellness activities.</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Daily mood logging</li>
                <li>✓ Face emotion detection</li>
                <li>✓ Wellness recommendations</li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-2xl p-6 border border-yellow-200">
              <Zap className="w-8 h-8 text-yellow-600 mb-3" />
              <h3 className="text-lg font-bold font-display mb-2">AI Support Chat</h3>
              <p className="text-sm text-muted-foreground mb-3">Get immediate support for ADHD challenges with challenge-based guidance and an AI chatbot providing coping strategies tailored to your needs.</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Challenge-based support</li>
                <li>✓ AI chatbot assistance</li>
                <li>✓ Works offline</li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl p-6 border border-indigo-200">
              <Users className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="text-lg font-bold font-display mb-2">Wellness & Community</h3>
              <p className="text-sm text-muted-foreground mb-3">Guided yoga, breathing exercises, calming music, and health monitoring. Connect with resources and doctor recommendations.</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Guided meditation</li>
                <li>✓ Health metrics tracking</li>
                <li>✓ Doctor directory</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Helps Section */}
      <section className="py-10 md:py-14 px-6 md:px-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold font-display">How MindFlex Helps You</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Designed to reduce overwhelm and build daily structure in a playful, non-judgmental way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                <div>
                  <h3 className="text-base font-bold font-display mb-1">Reduces Time Blindness</h3>
                  <p className="text-sm text-muted-foreground">Visual timers and countdowns help you stay aware of how much time has passed—critical for ADHD brains that struggle with time perception.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                <div>
                  <h3 className="text-base font-bold font-display mb-1">Builds Momentum Through Gamification</h3>
                  <p className="text-sm text-muted-foreground">Small wins, points, and badges make task completion feel rewarding, not punishing—leveraging ADHD brains' need for dopamine and motivation.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                <div>
                  <h3 className="text-base font-bold font-display mb-1">Tracks Mood & Health Connections</h3>
                  <p className="text-sm text-muted-foreground">Understand how sleep, stress, and wellness affect your focus. Visual charts show patterns only you can see.</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-pink-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">4</div>
                <div>
                  <h3 className="text-base font-bold font-display mb-1">Provides Immediate Support</h3>
                  <p className="text-sm text-muted-foreground">When you're overwhelmed or anxious, get instant coping strategies through our AI support chat—no waiting for appointments.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-yellow-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">5</div>
                <div>
                  <h3 className="text-base font-bold font-display mb-1">Creates Structure Without Rigidity</h3>
                  <p className="text-sm text-muted-foreground">Daily rotating tasks and flexible scheduling respect that ADHD brains need routine but thrive with variety.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">6</div>
                <div>
                  <h3 className="text-base font-bold font-display mb-1">Non-Judgmental & Compassionate</h3>
                  <p className="text-sm text-muted-foreground">No shame for missed tasks or bad days. Just gentle reminders and celebrating progress, however small.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose MindFlex */}
      <section className="py-10 md:py-14 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold font-display">Why MindFlex?</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Built by people who understand ADHD. For people living with ADHD.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-5">
              <div className="text-4xl font-bold text-blue-600 mb-1">100%</div>
              <p className="font-semibold mb-1">ADHD-Focused</p>
              <p className="text-sm text-muted-foreground">Every feature designed specifically for neurodiverse brains and how they work.</p>
            </div>
            <div className="text-center p-5">
              <div className="text-4xl font-bold text-purple-600 mb-1">No</div>
              <p className="font-semibold mb-1">Judgment</p>
              <p className="text-sm text-muted-foreground">We celebrate progress over perfection and understand that bad days happen.</p>
            </div>
            <div className="text-center p-5">
              <div className="text-4xl font-bold text-green-600 mb-1">24/7</div>
              <p className="font-semibold mb-1">Support</p>
              <p className="text-sm text-muted-foreground">Get help whenever you need it—your AI support coach is always available.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-14 px-6 md:px-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h2 className="text-3xl md:text-4xl font-bold font-display">Ready to Find Your Focus?</h2>
          <p className="text-base text-blue-100 max-w-2xl mx-auto">
            Join thousands of people who are building better daily habits and managing ADHD with MindFlex.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/register" className="px-6 py-3 rounded-full bg-white text-blue-600 font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2" data-testid="button-cta-signup">
              Start Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="px-6 py-3 rounded-full border-2 border-white text-white font-bold text-base hover:bg-white/10 transition-all">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-8 text-center text-muted-foreground text-sm border-t border-blue-100">
        <p>© 2024 MindFlex. Designed for neurodiverse minds. | <span className="text-xs">Not a substitute for professional medical advice. Consult a healthcare provider for diagnosis and treatment.</span></p>
      </footer>
    </div>
  );
}
