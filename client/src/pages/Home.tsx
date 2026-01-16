import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { LoginPanel } from "@/components/LoginPanel";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Trophy, Sparkles, ArrowRight, Menu, X, Heart, Shield, GraduationCap, Award, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginPanelOpen, setLoginPanelOpen] = useState(false);
  const { user } = useAuth();
  
  // Fetch live Roblox group stats
  const { data: groupStats } = trpc.roblox.getGroupStats.useQuery({ groupId: 864234322 });

  // Scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      section.classList.add('opacity-0');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Login Panel */}
      <LoginPanel isOpen={loginPanelOpen} onClose={() => setLoginPanelOpen(false)} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Riverside Primary School" className="h-10 w-10" />
              <span className="font-bold text-lg text-foreground">Riverside Primary</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-4">
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#programs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Programs</a>
              <a href="#leadership" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Leadership</a>
              <a href="#community" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Community</a>
              <Link href="/careers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Careers</Link>
              <Link href="/support" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Support</Link>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <a href="https://www.roblox.com/communities/864234322/WGP-Willow-Grove-Primary-School#!/about" target="_blank" rel="noopener noreferrer">Visit Roblox</a>
              </Button>
              {user ? (
                <UserProfileDropdown />
              ) : (
                <Button size="sm" variant="ghost" onClick={() => setLoginPanelOpen(true)} className="text-muted-foreground hover:text-foreground">
                  <LogIn size={18} className="mr-1" />
                  Login
                </Button>
              )}
            </div>

            <button 
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col gap-4">
                <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</Link>
                <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
                <a href="#programs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Programs</a>
                <a href="#leadership" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Leadership</a>
                <a href="#community" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Community</a>
                <Link href="/careers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Careers</Link>
                <Link href="/support" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Support</Link>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full" asChild>
                  <a href="https://www.roblox.com/communities/864234322/WGP-Willow-Grove-Primary-School#!/about" target="_blank" rel="noopener noreferrer">Visit Roblox</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80"></div>
        
        <div className="container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
                <span className="text-sm font-medium text-foreground">EST. 2026 • ROBLOX ROLEPLAY</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Welcome to<br />Riverside Primary School
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Experience an immersive educational roleplay community on Roblox. Join our vibrant community of learners, educators, and friends in a safe, engaging environment.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all" asChild>
                  <a href="https://www.roblox.com/communities/864234322/WGP-Willow-Grove-Primary-School#!/about" target="_blank" rel="noopener noreferrer">
                    Join Our School
                    <ArrowRight className="ml-2" size={20} />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-border hover:bg-card">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative">
                <img src="/images/logo.png" alt="School Logo" className="w-full max-w-md mx-auto drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Scroll to explore</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block px-4 py-1.5 bg-primary/20 rounded-full">
              <span className="text-sm font-semibold text-primary">ABOUT US</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              A Premier Roblox Roleplay Experience
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Riverside Primary School is a thriving educational roleplay community on Roblox where students, teachers, and staff come together to create memorable experiences. Our community is built on respect, creativity, and fun.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 pt-8 max-w-2xl mx-auto">
              <Card className="border-2 hover:border-primary transition-colors hover:shadow-lg bg-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Users className="text-primary" size={24} />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-foreground">Active Community</h3>
                  <p className="text-muted-foreground">Join hundreds of active members in our welcoming community</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors hover:shadow-lg bg-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="text-primary" size={24} />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-foreground">Engaging Roleplay</h3>
                  <p className="text-muted-foreground">Immersive scenarios and activities every day</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-card/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-1.5 bg-primary/20 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary">OUR PROGRAMS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              What We Offer
            </h2>
            <p className="text-lg text-muted-foreground">
              Riverside Primary School offers a variety of programs and activities designed to create an engaging and educational roleplay experience for all members.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary bg-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-foreground">Academic Classes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Participate in interactive lessons across various subjects including Math, Science, English, and more. Our dedicated teachers make learning fun and engaging.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary bg-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-foreground">Social Events</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Join exciting school events, assemblies, field trips, and special celebrations. Build friendships and create lasting memories with fellow students.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary bg-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Trophy className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-foreground">Extracurriculars</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Explore clubs, sports teams, and special activities. From art club to sports competitions, there's something for everyone to enjoy.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary bg-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-foreground">SEN Program</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Specialized support for students with Special Educational Needs. Our dedicated SEN team provides tailored assistance to ensure every student can thrive.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary bg-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-foreground">Pastoral Support</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our Pastoral Support area provides a safe space for students needing guidance, emotional support, or someone to talk to. We're here to help.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="text-blue-500" size={32} />
                </div>
                <div className="text-5xl font-bold text-foreground mb-2">
                  {groupStats?.memberCount || '...'}</div>
                <div className="text-lg font-semibold text-foreground mb-2">Active Students</div>
                <p className="text-sm text-muted-foreground">Bright young minds learning and growing every day</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap className="text-green-500" size={32} />
                </div>
                <div className="text-5xl font-bold text-foreground mb-2">5</div>
                <div className="text-lg font-semibold text-foreground mb-2">Expert Teachers</div>
                <p className="text-sm text-muted-foreground">Dedicated educators with years of experience</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center mb-6">
                  <Trophy className="text-yellow-500" size={32} />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2 break-words">Outstanding</div>
                <div className="text-lg font-semibold text-foreground mb-2">Awards Won</div>
                <p className="text-sm text-muted-foreground">Recognition for excellence in education</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-6">
                  <Heart className="text-purple-500" size={32} />
                </div>
                <div className="text-5xl font-bold text-foreground mb-2">98%</div>
                <div className="text-lg font-semibold text-foreground mb-2">Parent Satisfaction</div>
                <p className="text-sm text-muted-foreground">Highly rated by our school community</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section id="leadership" className="py-20 bg-card/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-1.5 bg-primary/20 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary">LEADERSHIP</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Meet Our Leadership Team
            </h2>
            <p className="text-lg text-muted-foreground">
              Our dedicated leadership team works tirelessly to ensure Riverside Primary School remains a safe, fun, and engaging community for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Mr S Malley */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary bg-card">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 mx-auto group-hover:scale-110 transition-transform border-4 border-primary/20">
                  <img src="/images/avatar-malley.png" alt="Mr S Malley" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-2xl mb-2 text-foreground">Mr S Malley</h3>
                <p className="text-primary font-semibold mb-3" style={{color: '#0091ff'}}>Group President</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Whole School Oversight including School Development, Executive Leadership Team oversight, and School operations.
                </p>
              </CardContent>
            </Card>

            {/* Miss M Brooke */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary bg-card">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 mx-auto group-hover:scale-110 transition-transform border-4 border-blue-500/20">
                  <img src="/images/avatar-brooke.png" alt="Miss M Brooke" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-2xl mb-2 text-foreground">Miss M Brooke</h3>
                <p className="text-blue-500 font-semibold mb-3" style={{color: '#0091ff'}}>Chair of Governors</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Whole School Oversight including Senior Leadership Team Oversight and Engagement Oversight.
                </p>
              </CardContent>
            </Card>

            {/* Mr J Forest */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary bg-card">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 mx-auto group-hover:scale-110 transition-transform border-4 border-green-500/20">
                  <img src="/images/avatar-forest.png" alt="Mr J Forest" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-2xl mb-2 text-foreground">Mr J Forest</h3>
                <p className="text-green-500 font-semibold mb-3" style={{color: '#0091ff'}}>Governing Body</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Human Resources Lead managing Support Tickets and Staff Training.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block px-4 py-1.5 bg-primary/20 rounded-full">
              <span className="text-sm font-semibold text-primary">COMMUNITY</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Join Our Thriving Community
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Riverside Primary School, we pride ourselves on creating a welcoming, inclusive environment where everyone can thrive. Our community values respect, kindness, and creativity.
            </p>

            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <Shield className="text-primary" size={32} />
                </div>
                <h4 className="font-bold text-lg text-foreground">Safe Environment</h4>
                <p className="text-muted-foreground text-sm">Moderated spaces with strict rules to ensure everyone feels safe</p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <Users className="text-primary" size={32} />
                </div>
                <h4 className="font-bold text-lg text-foreground">Active Staff Team</h4>
                <p className="text-muted-foreground text-sm">Dedicated staff members available to help and guide you</p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <Sparkles className="text-primary" size={32} />
                </div>
                <h4 className="font-bold text-lg text-foreground">Regular Updates</h4>
                <p className="text-muted-foreground text-sm">Constant improvements and new features to enhance your experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="join" className="py-24 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Ready to Join Riverside Primary School?
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Become part of our amazing community today. Whether you want to be a student, teacher, or staff member, there's a place for you at Riverside Primary.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-6" asChild>
                <a href="https://www.roblox.com/communities/864234322/WGP-Willow-Grove-Primary-School#!/about" target="_blank" rel="noopener noreferrer">
                  Join on Roblox
                  <ArrowRight className="ml-2" size={24} />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-border hover:bg-card text-lg px-8 py-6" asChild>
                <a href="https://discord.gg/riverside-primary" target="_blank" rel="noopener noreferrer">Join Discord</a>
              </Button>
              <Link href="/support">
                <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 text-lg px-8 py-6">Need Support?</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/images/logo.png" alt="Riverside Primary School" className="h-10 w-10" />
                <span className="font-bold text-lg text-foreground">Riverside Primary</span>
              </div>
              <p className="text-muted-foreground text-sm">
                A premier Roblox roleplay school community dedicated to creating engaging educational experiences.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Quick Links</h4>
              <div className="space-y-2">
                <a href="#about" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">About</a>
                <a href="#programs" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Programs</a>
                <a href="#leadership" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Leadership</a>
                <a href="#community" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Community</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Community</h4>
              <div className="space-y-2">
                <a href="https://discord.gg/riverside-primary" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Discord Server</a>
                <a href="https://www.roblox.com/communities/864234322/WGP-Willow-Grove-Primary-School#!/about" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Roblox Group</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Staff Applications</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Help Center</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Rules</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Contact Us</a>
              </div>
            </div>
          </div>

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
