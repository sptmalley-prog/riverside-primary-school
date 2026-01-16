import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Support() {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [appealType, setAppealType] = useState("");
  const [userOrGroup, setUserOrGroup] = useState("");
  const [email, setEmail] = useState("");
  const [robloxUsername, setRobloxUsername] = useState("");
  const [banReason, setBanReason] = useState("");
  const [appealReason, setAppealReason] = useState("");
  const [message, setMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const createSubmission = trpc.support.createSubmission.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!subCategory) {
      toast.error("Please select a sub category");
      return;
    }

    if (category === "Appeal") {
      if (!appealType || !userOrGroup || !email || !robloxUsername || !banReason || !appealReason) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    try {
      const webhookUrl = "https://discord.com/api/webhooks/1461199644381151410/qLny3cLztEdqGsgwdmRNPVWU1ipkoj5dHIQN-Ldbljz-jxxOH5doZDf24FP9qG-DbhMP";
      
      let embed;
      
      if (category === "Appeal") {
        embed = {
          title: `Ban Appeal Submission`,
          color: 0xff0000,
          thumbnail: {
            url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296189356/hfbsKIuKaSHuBnVn.png"
          },
          fields: [
            { name: "Category", value: category, inline: true },
            { name: "Sub Category", value: subCategory, inline: true },
            { name: "Appeal Type", value: appealType, inline: false },
            { name: "User or Group", value: userOrGroup, inline: false },
            { name: "Email", value: email, inline: false },
            { name: "Roblox Username", value: robloxUsername, inline: false },
            { name: "Ban Reason", value: banReason.substring(0, 1024), inline: false },
            { name: "Appeal Reason", value: appealReason.substring(0, 1024), inline: false },
            { name: "Additional Message", value: message || "N/A", inline: false }
          ],
          footer: {
            text: "Riverside Primary School - Support System",
            icon_url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296189356/hfbsKIuKaSHuBnVn.png"
          },
          timestamp: new Date().toISOString()
        };
      } else {
        embed = {
          title: `${category} - ${subCategory}`,
          color: 0x0091ff,
          thumbnail: {
            url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296189356/hfbsKIuKaSHuBnVn.png"
          },
          fields: [
            { name: "Category", value: category, inline: true },
            { name: "Sub Category", value: subCategory, inline: true },
            { name: "Message", value: message || "No message provided", inline: false }
          ],
          footer: {
            text: "Riverside Primary School - Support System",
            icon_url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296189356/hfbsKIuKaSHuBnVn.png"
          },
          timestamp: new Date().toISOString()
        };
      }

      // Save to database
      await createSubmission.mutateAsync({
        category,
        subCategory,
        appealType: category === "Appeal" ? appealType : undefined,
        userOrGroup: category === "Appeal" ? userOrGroup : undefined,
        email: category === "Appeal" ? email : undefined,
        robloxUsername: category === "Appeal" ? robloxUsername : undefined,
        banReason: category === "Appeal" ? banReason : undefined,
        appealReason: category === "Appeal" ? appealReason : undefined,
        message,
      });

      // Send to Discord webhook
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
      toast.success("Your submission has been sent successfully!");
      
      // Reset form
      setTimeout(() => {
        setCategory("");
        setSubCategory("");
        setAppealType("");
        setUserOrGroup("");
        setEmail("");
        setRobloxUsername("");
        setBanReason("");
        setAppealReason("");
        setMessage("");
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Failed to submit. Please try again.");
    }
  };

  const getSubCategories = () => {
    switch (category) {
      case "Appeal":
        return ["Submit Appeal"];
      case "Careers":
        return ["Apply now"];
      case "Feedback":
        return ["Compliments", "Complaints", "Suggestions"];
      case "Report something to us":
        return ["Report a person", "Report a group"];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Simplified Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="/images/logo.png" alt="Riverside Primary School" className="h-10 w-10" />
                <span className="font-bold text-lg text-foreground">Support</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Support Form */}
      <div className="pt-24 pb-20">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Support Center</h1>
            <p className="text-lg text-muted-foreground">
              We're here to help. Submit your inquiry below and we'll get back to you as soon as possible.
            </p>
          </div>

          <Card className="border-2 bg-card">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-foreground">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={category} onValueChange={(value) => { setCategory(value); setSubCategory(""); }}>
                    <SelectTrigger id="category" className="bg-background/50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Appeal">Appeal</SelectItem>
                      <SelectItem value="Careers">Careers</SelectItem>
                      <SelectItem value="Feedback">Feedback</SelectItem>
                      <SelectItem value="Report something to us">Report something to us</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sub Category */}
                {category && (
                  <div className="space-y-2">
                    <Label htmlFor="subCategory" className="text-foreground">
                      Sub Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={subCategory} onValueChange={setSubCategory}>
                      <SelectTrigger id="subCategory" className="bg-background/50">
                        <SelectValue placeholder="Select sub category" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSubCategories().map((sub) => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Careers Info Box */}
                {category === "Careers" && subCategory === "Apply now" && (
                  <Card className="bg-primary/10 border-primary/20">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-2 text-foreground">Career Opportunities</h3>
                      <p className="text-muted-foreground mb-4">
                        We're always looking for talented individuals who share our passion for innovation and excellence in virtual experiences to help us build the future.
                      </p>
                      <Link href="/careers">
                        <Button type="button" variant="outline" className="w-full">
                          View Open Positions
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {/* Ban Appeal Form */}
                {category === "Appeal" && subCategory === "Submit Appeal" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="appealType" className="text-foreground">
                        Appeal Type <span className="text-red-500">*</span>
                      </Label>
                      <Select value={appealType} onValueChange={setAppealType}>
                        <SelectTrigger id="appealType" className="bg-background/50">
                          <SelectValue placeholder="Select appeal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Discord Ban">Discord Ban</SelectItem>
                          <SelectItem value="Roblox Group Ban">Roblox Group Ban</SelectItem>
                          <SelectItem value="Both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="userOrGroup" className="text-foreground">
                        User or Group <span className="text-red-500">*</span>
                      </Label>
                      <Select value={userOrGroup} onValueChange={setUserOrGroup}>
                        <SelectTrigger id="userOrGroup" className="bg-background/50">
                          <SelectValue placeholder="Select user or group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="User">User</SelectItem>
                          <SelectItem value="Group">Group</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background/50"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="robloxUsername" className="text-foreground">
                        Roblox Username <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="robloxUsername"
                        value={robloxUsername}
                        onChange={(e) => setRobloxUsername(e.target.value)}
                        className="bg-background/50"
                        placeholder="Your Roblox username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="banReason" className="text-foreground">
                        Ban Reason <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="banReason"
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        className="bg-background/50 min-h-[100px]"
                        placeholder="What reason were you given for the ban?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appealReason" className="text-foreground">
                        Appeal Reason <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="appealReason"
                        value={appealReason}
                        onChange={(e) => setAppealReason(e.target.value)}
                        className="bg-background/50 min-h-[100px]"
                        placeholder="Why do you believe the ban should be lifted?"
                      />
                    </div>
                  </>
                )}

                {/* Message Box (for all categories) */}
                {category && subCategory && subCategory !== "Apply now" && (
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground">
                      {category === "Appeal" ? "Additional Information" : "Message"}
                      {category !== "Appeal" && <span className="text-red-500"> *</span>}
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-background/50 min-h-[120px]"
                      placeholder="Type your message here..."
                    />
                  </div>
                )}

                {/* Submit Button */}
                {category && subCategory && subCategory !== "Apply now" && (
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={submitSuccess}
                  >
                    {submitSuccess ? "Sent Successfully!" : "Send Message"}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
