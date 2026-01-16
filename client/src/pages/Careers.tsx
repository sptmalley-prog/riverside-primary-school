import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface JobListing {
  id: string;
  title: string;
  description: string;
  posted: string;
}

const jobListings: JobListing[] = [
  {
    id: "teaching-staff",
    title: "Teaching Staff",
    description: "Join Our Team at Riverside Primary School! Are you passionate about education and inspiring the next generation of learners? At Riverside Primary School, we're proud to educate students across a thriving and dynamic online community. Every lesson brings a new opportunity to connect, challenge, and make a difference, all within a supportive and professional environment.",
    posted: "15/01/2026"
  },
  {
    id: "assistant-headteacher",
    title: "Assistant Headteacher",
    description: "Join Our Team at Riverside Primary School! Do you have a passion for helping students reach their full potential? We're looking for dedicated Assistant Headteachers to support our leadership team in creating an exceptional educational experience.",
    posted: "15/01/2026"
  },
  {
    id: "deputy-headteacher",
    title: "Deputy Headteacher",
    description: "Join Our Team at Riverside Primary School! Are you ready to take on a leadership role? We're seeking experienced Deputy Headteachers to help guide our school community and support our educational mission.",
    posted: "15/01/2026"
  },
  {
    id: "senior-deputy-headteacher",
    title: "Senior Deputy Headteacher",
    description: "Join Our Team at Riverside Primary School! Looking for a senior leadership opportunity? We need experienced Senior Deputy Headteachers to help shape the future of our school and mentor our staff.",
    posted: "15/01/2026"
  },
  {
    id: "headteacher",
    title: "Headteacher",
    description: "Join Our Team at Riverside Primary School! Ready to lead? We're seeking an exceptional Headteacher to guide our school community, set strategic direction, and inspire excellence across all areas of school life.",
    posted: "15/01/2026"
  }
];

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  if (selectedJob) {
    return <JobApplication job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Riverside Primary School" className="h-10 w-10" />
              <span className="font-bold text-lg text-foreground">Riverside Primary</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link href="/#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link href="/#programs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Programs</Link>
              <Link href="/#leadership" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Leadership</Link>
              <Link href="/#community" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Community</Link>
              <Link href="/careers" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Careers</Link>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <a href="https://www.roblox.com/communities/864234322/WGP-Willow-Grove-Primary-School#!/about" target="_blank" rel="noopener noreferrer">
                  Visit Roblox
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-16 bg-background">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Riverside Primary School
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Join our team and help shape the future of education in our Roblox roleplay community.
          </p>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 bg-background">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            {jobListings.map((job) => (
              <Card key={job.id} className="bg-gradient-to-br from-card to-card/50 border-2 border-border hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-3 mb-4">
                    <Clock className="text-muted-foreground mt-1" size={20} />
                    <span className="text-sm text-muted-foreground">Posted: {job.posted}</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-foreground mb-4">{job.title}</h2>
                  
                  <p className="text-muted-foreground mb-6 line-clamp-2">
                    {job.description}
                  </p>

                  <Button 
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setSelectedJob(job)}
                  >
                    Apply Now
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 mt-20">
        <div className="container">
          <div className="border-t border-border pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © 2026 Riverside Primary School. A Roblox Roleplay Community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function JobApplication({ job, onBack }: { job: JobListing; onBack: () => void }) {
  const [formData, setFormData] = useState({
    robloxUsername: "",
    timezone: "",
    email: "",
    department: "",
    experience: "",
    standOut: "",
    interest: "",
    ageGroup: "",
    additionalInfo: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const webhookUrl = "https://discord.com/api/webhooks/1461194525967126548/_zu-aUhJREkLaOgdV_CCqrN0nYCx1y4pR4Q4uqARI-ewKuGtIsF-DNrVegfua1vBfPAY";
      
      const embed = {
        title: `New Application: ${job.title}`,
        color: 0x0091ff,
        thumbnail: {
          url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296189356/hfbsKIuKaSHuBnVn.png"
        },
        fields: [
          { name: "Roblox Username", value: formData.robloxUsername, inline: true },
          { name: "Timezone", value: formData.timezone, inline: true },
          { name: "Email", value: formData.email, inline: false },
          { name: "Teaching Department", value: formData.department, inline: false },
          { name: "Experience", value: formData.experience.substring(0, 1024), inline: false },
          { name: "What makes you stand out?", value: formData.standOut.substring(0, 1024), inline: false },
          { name: "Why interested?", value: formData.interest.substring(0, 1024), inline: false },
          { name: "Age Group", value: formData.ageGroup, inline: true },
          { name: "Additional Info", value: formData.additionalInfo || "N/A", inline: false }
        ],
        footer: {
          text: "Riverside Primary School - Staff Application",
          icon_url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296189356/hfbsKIuKaSHuBnVn.png"
        },
        timestamp: new Date().toISOString()
      };

      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: "Riverside Primary School",
          avatar_url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296189356/hfbsKIuKaSHuBnVn.png",
          embeds: [embed] 
        })
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        onBack();
      }, 3000);
    } catch (error) {
      console.error("Failed to submit application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Application Submitted!</h2>
          <p className="text-xl text-muted-foreground">Thank you for applying. We'll review your application soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container max-w-3xl">
        <Button variant="outline" onClick={onBack} className="mb-8">
          ← Back to Careers
        </Button>

        <h1 className="text-5xl font-bold text-foreground mb-8">{job.title}</h1>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Team at Riverside Primary School!</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">{job.description}</p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">Benefits</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Free professional training courses</li>
                <li>• Opportunity to meet new people daily</li>
                <li>• Flexible session times (accommodating GMT, EST, and more time zones)</li>
                <li>• Extended leave available for holiday, educational, or compassionate reasons</li>
                <li>• Job security with a financially stable establishment</li>
                <li>• Work alongside a dedicated and talented staff team</li>
                <li>• Engage in a highly realistic educational environment</li>
                <li>• Permanent staff position</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">Requirements</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Must be at least 13 years old with unrestricted access to ROBLOX and Discord</li>
                <li>• Fluent in English with proper spelling, punctuation, and grammar</li>
                <li>• Friendly, professional, and adaptable attitude</li>
                <li>• Strong customer service skills and a positive, "can-do" attitude</li>
                <li>• Must not be blacklisted or associated with banned groups, users, or exploiters</li>
                <li>• Must complete one week of training upon acceptance</li>
                <li>• Ability to meet a weekly session quota of 300 minutes (exemptions may apply)</li>
                <li>• Plan educational, engaging lessons to ensure effective student learning</li>
                <li>• Maintain a strong and positive reputation within all Riverside groups</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-foreground mb-2">
              Please enter your ROBLOX username: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.robloxUsername}
              onChange={(e) => setFormData({ ...formData, robloxUsername: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">
              Please enter your time zone: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">
              Please enter your email address: <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">
              Please enter which teaching department you wish to apply for: <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-muted-foreground mb-2">For example: Mathematics, Humanities</p>
            <input
              type="text"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">
              What experience do you have? <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">
              What makes you stand out from other applicants? <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={formData.standOut}
              onChange={(e) => setFormData({ ...formData, standOut: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">
              Why are you interested in a career at Riverside Primary School? <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={formData.interest}
              onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">
              What age group on Roblox are you in? (Used for what years you will be teaching) <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={formData.ageGroup}
              onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">
              Is there anything else that you'd like to share with us?
            </label>
            <textarea
              rows={6}
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
}
