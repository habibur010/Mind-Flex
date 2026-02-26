import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Stethoscope, Phone, Mail, Globe, MapPin, Clock, Star, Search, ExternalLink, AlertCircle, Shield, ChevronDown, ChevronUp, BookOpen, ClipboardList, MessageCircle, Video, Users, Heart, Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  languages: string[];
  availability: string;
  consultType: string[];
  phone: string;
  email: string;
  website?: string;
  location: string;
  rating: number;
  about: string;
  tags: string[];
}

const DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    specialty: "Psychiatrist — ADHD Specialist",
    qualification: "MBBS, MD (Psychiatry), NIMHANS",
    experience: "15+ years",
    languages: ["English", "Hindi"],
    availability: "Mon-Fri, 10 AM - 6 PM",
    consultType: ["In-Person", "Video Call"],
    phone: "+91-98765-43210",
    email: "dr.priya@mindcare.in",
    website: "https://www.mindcareclinic.in",
    location: "Mumbai, Maharashtra",
    rating: 4.8,
    about: "Specializes in adult ADHD diagnosis and management. Uses a combination of medication management and behavioral strategies tailored for ADHD patients.",
    tags: ["ADHD", "Anxiety", "Medication Management"],
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    specialty: "Clinical Psychologist",
    qualification: "PhD (Clinical Psychology), RCI Licensed",
    experience: "12+ years",
    languages: ["English", "Hindi", "Tamil"],
    availability: "Mon-Sat, 9 AM - 5 PM",
    consultType: ["In-Person", "Video Call", "Phone"],
    phone: "+91-87654-32109",
    email: "dr.rajesh@cognitivewellness.com",
    website: "https://www.cognitivewellness.com",
    location: "Bangalore, Karnataka",
    rating: 4.7,
    about: "Expert in Cognitive Behavioral Therapy (CBT) for ADHD and anxiety disorders. Focuses on executive function training, time management skills, and emotional regulation techniques.",
    tags: ["CBT", "ADHD Coaching", "Anxiety", "Executive Function"],
  },
  {
    id: "3",
    name: "Dr. Ananya Desai",
    specialty: "Neuropsychiatrist",
    qualification: "MBBS, DPM, DNB (Psychiatry)",
    experience: "10+ years",
    languages: ["English", "Hindi", "Gujarati"],
    availability: "Tue-Sat, 11 AM - 7 PM",
    consultType: ["In-Person", "Video Call"],
    phone: "+91-76543-21098",
    email: "dr.ananya@neurominds.in",
    location: "Ahmedabad, Gujarat",
    rating: 4.9,
    about: "Combines neurological assessment with psychiatric care for comprehensive evaluation. Specialized in ADHD, epilepsy, migraine, and comorbid conditions like anxiety and sleep disorders.",
    tags: ["Neuropsychiatry", "Sleep Disorders", "ADHD", "Epilepsy"],
  },
  {
    id: "4",
    name: "Dr. Vikram Mehta",
    specialty: "Child & Adolescent Psychiatrist",
    qualification: "MBBS, MD (Psychiatry), Fellowship in Child Psychiatry",
    experience: "18+ years",
    languages: ["English", "Hindi", "Punjabi"],
    availability: "Mon-Fri, 9 AM - 4 PM",
    consultType: ["In-Person", "Video Call"],
    phone: "+91-65432-10987",
    email: "dr.vikram@youngminds.org",
    website: "https://www.youngmindsclinic.org",
    location: "Delhi NCR",
    rating: 4.6,
    about: "Specializes in ADHD, autism spectrum, learning disabilities, and behavioral issues in children and teenagers. Works closely with families and schools to create supportive environments.",
    tags: ["Child ADHD", "Autism", "Learning Disabilities", "Family Therapy"],
  },
  {
    id: "5",
    name: "Dr. Meera Nair",
    specialty: "Behavioral Therapist & Wellness Coach",
    qualification: "MSc (Psychology), Certified ADHD Coach",
    experience: "8+ years",
    languages: ["English", "Hindi", "Malayalam"],
    availability: "Mon-Sat, 10 AM - 8 PM",
    consultType: ["Video Call", "Phone", "Chat"],
    phone: "+91-54321-09876",
    email: "meera@adhdcoaching.in",
    website: "https://www.adhdcoaching.in",
    location: "Online (Pan-India)",
    rating: 4.8,
    about: "Certified coach offering practical strategies for daily life management. Specializes in ADHD, stress management, habit building, and emotional well-being for adults.",
    tags: ["ADHD Coaching", "Stress Management", "Habit Building", "Productivity"],
  },
  {
    id: "6",
    name: "Dr. Suresh Patel",
    specialty: "Psychiatrist — Mood & Attention Disorders",
    qualification: "MBBS, MD (Psychiatry), AIIMS",
    experience: "20+ years",
    languages: ["English", "Hindi", "Marathi"],
    availability: "Mon, Wed, Fri, 10 AM - 5 PM",
    consultType: ["In-Person"],
    phone: "+91-43210-98765",
    email: "dr.suresh@mentalhealthfirst.in",
    location: "Pune, Maharashtra",
    rating: 4.5,
    about: "Senior psychiatrist with extensive experience in treating depression, bipolar disorder, attention disorders, and OCD. Known for thorough diagnostic assessments and personalized treatment plans.",
    tags: ["Depression", "Bipolar Disorder", "OCD", "Mood Disorders"],
  },
  {
    id: "7",
    name: "Dr. Kavitha Rajan",
    specialty: "Clinical Psychologist — Anxiety & Trauma",
    qualification: "MPhil (Clinical Psychology), PhD, RCI Licensed",
    experience: "14+ years",
    languages: ["English", "Hindi", "Kannada"],
    availability: "Mon-Fri, 9 AM - 6 PM",
    consultType: ["In-Person", "Video Call"],
    phone: "+91-91234-56789",
    email: "dr.kavitha@healingminds.in",
    website: "https://www.healingmindstherapy.in",
    location: "Bangalore, Karnataka",
    rating: 4.9,
    about: "Specializes in anxiety disorders, PTSD, panic attacks, and trauma recovery. Uses EMDR and CBT techniques to help patients process traumatic experiences and manage chronic anxiety.",
    tags: ["Anxiety", "PTSD", "Panic Disorder", "Trauma", "EMDR"],
  },
  {
    id: "8",
    name: "Dr. Arjun Reddy",
    specialty: "Psychiatrist — Depression & Bipolar",
    qualification: "MBBS, MD (Psychiatry), NIMHANS",
    experience: "16+ years",
    languages: ["English", "Hindi", "Telugu"],
    availability: "Mon-Sat, 10 AM - 5 PM",
    consultType: ["In-Person", "Video Call", "Phone"],
    phone: "+91-82345-67890",
    email: "dr.arjun@mindbalance.in",
    website: "https://www.mindbalanceclinic.in",
    location: "Hyderabad, Telangana",
    rating: 4.7,
    about: "Expert in treating major depressive disorder, bipolar disorder, and treatment-resistant depression. Combines medication management with psychotherapy for holistic care.",
    tags: ["Depression", "Bipolar Disorder", "Treatment-Resistant Depression", "Medication"],
  },
  {
    id: "9",
    name: "Dr. Sneha Gupta",
    specialty: "Psychotherapist — OCD & Phobias",
    qualification: "PhD (Psychology), Certified ERP Therapist",
    experience: "11+ years",
    languages: ["English", "Hindi"],
    availability: "Tue-Sat, 11 AM - 7 PM",
    consultType: ["In-Person", "Video Call"],
    phone: "+91-73456-78901",
    email: "dr.sneha@ocdrecovery.in",
    location: "Delhi NCR",
    rating: 4.8,
    about: "Specializes in Obsessive-Compulsive Disorder and specific phobias using Exposure and Response Prevention (ERP). Also treats social anxiety, health anxiety, and body dysmorphic disorder.",
    tags: ["OCD", "Phobias", "Social Anxiety", "ERP Therapy", "Body Dysmorphia"],
  },
  {
    id: "10",
    name: "Dr. Fatima Khan",
    specialty: "Psychiatrist — Sleep & Eating Disorders",
    qualification: "MBBS, MD (Psychiatry), Fellowship in Sleep Medicine",
    experience: "13+ years",
    languages: ["English", "Hindi", "Urdu"],
    availability: "Mon-Fri, 9 AM - 5 PM",
    consultType: ["In-Person", "Video Call"],
    phone: "+91-64567-89012",
    email: "dr.fatima@sleepwell.in",
    website: "https://www.sleepwellclinic.in",
    location: "Chennai, Tamil Nadu",
    rating: 4.6,
    about: "Dual expertise in sleep disorders (insomnia, sleep apnea, circadian rhythm disorders) and eating disorders (anorexia, bulimia, binge eating). Focuses on the connection between sleep, nutrition, and mental health.",
    tags: ["Insomnia", "Sleep Disorders", "Eating Disorders", "Anorexia", "Bulimia"],
  },
  {
    id: "11",
    name: "Dr. Rohit Saxena",
    specialty: "Addiction Psychiatrist",
    qualification: "MBBS, MD (Psychiatry), Certificate in Addiction Medicine",
    experience: "17+ years",
    languages: ["English", "Hindi"],
    availability: "Mon-Sat, 8 AM - 4 PM",
    consultType: ["In-Person", "Phone"],
    phone: "+91-55678-90123",
    email: "dr.rohit@recoverypath.in",
    website: "https://www.recoverypathclinic.in",
    location: "Lucknow, Uttar Pradesh",
    rating: 4.5,
    about: "Specializes in substance use disorders, behavioral addictions (gaming, internet, gambling), and dual diagnosis treatment. Provides comprehensive rehabilitation support and relapse prevention.",
    tags: ["Addiction", "Substance Abuse", "Dual Diagnosis", "Rehabilitation", "Gaming Addiction"],
  },
  {
    id: "12",
    name: "Dr. Lakshmi Iyer",
    specialty: "Geriatric Psychiatrist",
    qualification: "MBBS, MD (Psychiatry), Fellowship in Geriatric Psychiatry",
    experience: "12+ years",
    languages: ["English", "Hindi", "Tamil", "Malayalam"],
    availability: "Mon-Fri, 10 AM - 4 PM",
    consultType: ["In-Person", "Video Call", "Phone"],
    phone: "+91-46789-01234",
    email: "dr.lakshmi@eldercare.in",
    location: "Kochi, Kerala",
    rating: 4.7,
    about: "Focuses on mental health in elderly patients including dementia, Alzheimer's, late-life depression, anxiety, and cognitive decline. Provides caregiver support and family counseling.",
    tags: ["Dementia", "Alzheimer's", "Elderly Care", "Cognitive Decline", "Caregiver Support"],
  },
  {
    id: "13",
    name: "Dr. Nandini Bhatt",
    specialty: "Counseling Psychologist — Stress & Burnout",
    qualification: "MA (Clinical Psychology), Certified Mindfulness Trainer",
    experience: "9+ years",
    languages: ["English", "Hindi", "Gujarati"],
    availability: "Mon-Sat, 11 AM - 8 PM",
    consultType: ["Video Call", "Phone", "Chat"],
    phone: "+91-37890-12345",
    email: "nandini@calmspace.in",
    website: "https://www.calmspacetherapy.in",
    location: "Online (Pan-India)",
    rating: 4.8,
    about: "Helps professionals dealing with workplace stress, burnout, and work-life balance issues. Uses mindfulness-based stress reduction (MBSR), relaxation therapy, and positive psychology techniques.",
    tags: ["Stress", "Burnout", "Work-Life Balance", "Mindfulness", "Corporate Wellness"],
  },
  {
    id: "14",
    name: "Dr. Siddharth Joshi",
    specialty: "Psychiatrist — Schizophrenia & Psychosis",
    qualification: "MBBS, MD (Psychiatry), DM (Psychiatry)",
    experience: "22+ years",
    languages: ["English", "Hindi", "Marathi"],
    availability: "Mon, Wed, Fri, 9 AM - 3 PM",
    consultType: ["In-Person"],
    phone: "+91-28901-23456",
    email: "dr.siddharth@mindrestored.in",
    location: "Mumbai, Maharashtra",
    rating: 4.6,
    about: "Senior psychiatrist with deep expertise in schizophrenia, psychotic disorders, and severe mental illness. Provides long-term management plans and family psychoeducation.",
    tags: ["Schizophrenia", "Psychosis", "Severe Mental Illness", "Long-term Care"],
  },
  {
    id: "15",
    name: "Dr. Pooja Verma",
    specialty: "Couple & Family Therapist",
    qualification: "PhD (Psychology), Certified Family Therapist (AAMFT)",
    experience: "10+ years",
    languages: ["English", "Hindi"],
    availability: "Tue-Sat, 12 PM - 8 PM",
    consultType: ["In-Person", "Video Call"],
    phone: "+91-19012-34567",
    email: "dr.pooja@relationshipcare.in",
    website: "https://www.relationshipcareclinic.in",
    location: "Jaipur, Rajasthan",
    rating: 4.7,
    about: "Specializes in relationship counseling, marital conflicts, family dynamics, and interpersonal issues. Also helps individuals with codependency, grief, and adjustment disorders.",
    tags: ["Relationship Counseling", "Family Therapy", "Grief", "Marital Issues", "Codependency"],
  },
];

const HELPLINES = [
  {
    name: "Vandrevala Foundation Helpline",
    number: "1860-2662-345",
    description: "24/7 mental health support in multiple languages",
    available: "24/7",
  },
  {
    name: "iCall (TISS)",
    number: "9152987821",
    description: "Professional counseling by trained psychologists",
    available: "Mon-Sat, 8 AM - 10 PM",
  },
  {
    name: "NIMHANS Helpline",
    number: "080-46110007",
    description: "National Institute of Mental Health and Neurosciences",
    available: "Mon-Sat, 9 AM - 5 PM",
  },
  {
    name: "Mpower Helpline",
    number: "1800-120-820-050",
    description: "Free mental health counseling (toll-free)",
    available: "24/7",
  },
];

const PREPARATION_TIPS = [
  {
    title: "Before Your Appointment",
    icon: ClipboardList,
    items: [
      "Write down your symptoms and when they started",
      "Note how symptoms affect your daily life, work, and relationships",
      "List all medications and supplements you're currently taking",
      "Bring any previous medical reports or assessments",
      "Prepare questions you want to ask the doctor",
    ],
  },
  {
    title: "What to Discuss",
    icon: MessageCircle,
    items: [
      "Your main symptoms and how long you've had them",
      "Sleep quality, appetite, and energy levels",
      "Mood changes, anxiety, or emotional challenges",
      "Difficulty focusing, memory, or concentration issues",
      "Impact on work, studies, or relationships",
      "Any recent major life changes or stressors",
      "Family history of mental health conditions",
    ],
  },
  {
    title: "After Your Visit",
    icon: BookOpen,
    items: [
      "Follow the prescribed treatment plan consistently",
      "Keep a symptom journal to track progress",
      "Schedule follow-up appointments as recommended",
      "Reach out if side effects occur from medication",
      "Consider joining an ADHD support group",
    ],
  },
];

const SPECIALTIES = ["All", "Psychiatrist", "Psychologist", "Neuropsychiatrist", "ADHD Specialist", "Therapist", "Child Specialist", "Addiction", "Geriatric", "Family & Couple"];
const CONSULT_TYPES = ["All", "In-Person", "Video Call", "Phone", "Chat"];

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-lg text-foreground" data-testid={`doctor-name-${doctor.id}`}>{doctor.name}</h3>
                <p className="text-sm text-primary font-medium">{doctor.specialty}</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg flex-shrink-0">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-bold text-amber-700">{doctor.rating}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{doctor.qualification}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {doctor.tags.map((tag) => (
                <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{doctor.experience}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{doctor.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{doctor.languages.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{doctor.availability}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {doctor.consultType.map((type) => (
            <span key={type} className={cn(
              "text-xs px-2 py-1 rounded-full font-medium border",
              type === "Video Call" && "bg-blue-50 text-blue-700 border-blue-200",
              type === "In-Person" && "bg-green-50 text-green-700 border-green-200",
              type === "Phone" && "bg-purple-50 text-purple-700 border-purple-200",
              type === "Chat" && "bg-orange-50 text-orange-700 border-orange-200"
            )}>
              {type === "Video Call" && <Video className="w-3 h-3 inline mr-1" />}
              {type === "In-Person" && <Users className="w-3 h-3 inline mr-1" />}
              {type === "Phone" && <Phone className="w-3 h-3 inline mr-1" />}
              {type === "Chat" && <MessageCircle className="w-3 h-3 inline mr-1" />}
              {type}
            </span>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          data-testid={`toggle-doctor-${doctor.id}`}
          className="text-sm text-primary font-medium mt-3 flex items-center gap-1 hover:underline"
        >
          {expanded ? "Show Less" : "View Details & Contact"}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 space-y-4"
            >
              <p className="text-sm text-muted-foreground">{doctor.about}</p>

              <div className="space-y-2">
                <a
                  href={`tel:${doctor.phone}`}
                  data-testid={`call-doctor-${doctor.id}`}
                  className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Call</p>
                    <p className="text-xs text-green-600">{doctor.phone}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${doctor.email}`}
                  data-testid={`email-doctor-${doctor.id}`}
                  className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Email</p>
                    <p className="text-xs text-blue-600">{doctor.email}</p>
                  </div>
                </a>

                {doctor.website && (
                  <a
                    href={doctor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`website-doctor-${doctor.id}`}
                    className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-semibold text-purple-800">Visit Website</p>
                      <p className="text-xs text-purple-600">{doctor.website}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-purple-400 ml-auto" />
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function DoctorConsult() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedConsultType, setSelectedConsultType] = useState("All");
  const [activeTab, setActiveTab] = useState<"doctors" | "helplines" | "prepare">("doctors");

  const filteredDoctors = DOCTORS.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpecialty =
      selectedSpecialty === "All" ||
      doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase()) ||
      (selectedSpecialty === "ADHD Specialist" && (doc.tags.includes("ADHD") || doc.tags.includes("ADHD Coaching") || doc.specialty.includes("ADHD"))) ||
      (selectedSpecialty === "Therapist" && (doc.specialty.includes("Therapist") || doc.specialty.includes("Coach") || doc.specialty.includes("Counseling"))) ||
      (selectedSpecialty === "Child Specialist" && doc.specialty.includes("Child")) ||
      (selectedSpecialty === "Addiction" && doc.specialty.includes("Addiction")) ||
      (selectedSpecialty === "Geriatric" && doc.specialty.includes("Geriatric")) ||
      (selectedSpecialty === "Family & Couple" && (doc.specialty.includes("Family") || doc.specialty.includes("Couple")));

    const matchesConsultType =
      selectedConsultType === "All" || doc.consultType.includes(selectedConsultType);

    return matchesSearch && matchesSpecialty && matchesConsultType;
  });

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              Doctor Consultation
            </h1>
            <p className="text-muted-foreground mt-2">
              Find mental health professionals for ADHD, anxiety, depression, and more
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Important Notice</p>
            <p className="text-sm text-amber-700 mt-1">
              This is a directory of mental health professionals for reference purposes. Always verify credentials and availability directly with the doctor before booking. In case of emergency, call your local emergency number immediately.
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[
            { id: "doctors" as const, label: "Find Doctors", icon: Stethoscope },
            { id: "helplines" as const, label: "Helplines", icon: Phone },
            { id: "prepare" as const, label: "Prepare for Visit", icon: ClipboardList },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`tab-${tab.id}`}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "doctors" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, specialty, or location..."
                  data-testid="input-search-doctors"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                data-testid="select-specialty"
                className="px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>{s === "All" ? "All Specialties" : s}</option>
                ))}
              </select>
              <select
                value={selectedConsultType}
                onChange={(e) => setSelectedConsultType(e.target.value)}
                data-testid="select-consult-type"
                className="px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {CONSULT_TYPES.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "All Types" : c}</option>
                ))}
              </select>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredDoctors.length} of {DOCTORS.length} professionals
            </p>

            <div className="grid gap-4">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))
              ) : (
                <div className="text-center py-12 bg-card border border-border rounded-2xl">
                  <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-lg font-semibold text-foreground">No doctors found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "helplines" && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h3 className="font-bold text-lg text-red-800">Emergency?</h3>
              </div>
              <p className="text-sm text-red-700">
                If you or someone you know is in immediate danger or experiencing a mental health crisis, please call <strong>112</strong> (National Emergency Number) or go to your nearest hospital emergency room immediately.
              </p>
            </div>

            <h3 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" /> Mental Health Helplines
            </h3>

            <div className="grid gap-4">
              {HELPLINES.map((helpline, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-foreground">{helpline.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{helpline.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{helpline.available}</span>
                      </div>
                    </div>
                    <a
                      href={`tel:${helpline.number}`}
                      data-testid={`call-helpline-${idx}`}
                      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors flex-shrink-0"
                    >
                      <Phone className="w-4 h-4" />
                      {helpline.number}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mt-6">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="w-5 h-5 text-blue-500" />
                <h4 className="font-bold text-blue-800">Online Resources</h4>
              </div>
              <div className="space-y-3">
                <a href="https://www.thelivelovelaughfoundation.org" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white/60 rounded-xl hover:bg-white transition-colors">
                  <div>
                    <p className="font-semibold text-sm text-foreground">The Live Love Laugh Foundation</p>
                    <p className="text-xs text-muted-foreground">Mental health awareness and support</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                </a>
                <a href="https://www.icallhelpline.org" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white/60 rounded-xl hover:bg-white transition-colors">
                  <div>
                    <p className="font-semibold text-sm text-foreground">iCall — TISS</p>
                    <p className="text-xs text-muted-foreground">Professional counseling services</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                </a>
                <a href="https://www.nimhans.ac.in" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white/60 rounded-xl hover:bg-white transition-colors">
                  <div>
                    <p className="font-semibold text-sm text-foreground">NIMHANS</p>
                    <p className="text-xs text-muted-foreground">National Institute of Mental Health</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === "prepare" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-indigo-500" />
                <h3 className="font-bold text-lg text-indigo-800">Getting the Most from Your Visit</h3>
              </div>
              <p className="text-sm text-indigo-700">
                Preparing for your doctor's appointment helps ensure you get the most out of your consultation time. Here's a guide to help you before, during, and after your visit.
              </p>
            </div>

            {PREPARATION_TIPS.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "p-2.5 rounded-xl",
                    idx === 0 && "bg-blue-500",
                    idx === 1 && "bg-purple-500",
                    idx === 2 && "bg-emerald-500"
                  )}>
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{itemIdx + 1}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-amber-500">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Important Questions to Ask Your Doctor</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "What is my diagnosis and what does it mean?",
                  "Are there non-medication treatment options?",
                  "What are the side effects of recommended medication?",
                  "What lifestyle changes can improve my condition?",
                  "Should I see a specialist or therapist alongside?",
                  "How often should I schedule follow-up visits?",
                  "Can my condition coexist with other disorders?",
                  "Are there support groups you recommend?",
                  "How long will treatment take to show results?",
                  "What should I do in a crisis or emergency?",
                ].map((question, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <MessageCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-amber-800">{question}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
