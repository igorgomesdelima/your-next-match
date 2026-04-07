import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Trophy } from "lucide-react";
import Footer from "@/components/layout/Footer";
import logo from "@/assets/matchup-logo.png";

const CreateTournament = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="MatchUp" width={28} height={28} />
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              Match<span className="text-gradient-primary">Up</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Trophy className="text-primary-foreground" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Create Tournament</h1>
            <p className="text-sm text-muted-foreground">Set up your competition in minutes</p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h3 className="font-bold text-foreground">Basic Info</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Tournament Name</Label>
              <Input id="name" placeholder="e.g. Summer Slam 2026" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sport</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select sport" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tennis">Tennis</SelectItem>
                    <SelectItem value="beach-tennis">Beach Tennis</SelectItem>
                    <SelectItem value="padel">Padel</SelectItem>
                    <SelectItem value="squash">Squash</SelectItem>
                    <SelectItem value="badminton">Badminton</SelectItem>
                    <SelectItem value="pickleball">Pickleball</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Format</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select format" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-elimination">Single Elimination</SelectItem>
                    <SelectItem value="double-elimination">Double Elimination</SelectItem>
                    <SelectItem value="round-robin">Round Robin</SelectItem>
                    <SelectItem value="swiss">Swiss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Surface</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select surface" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="hard">Hard Court</SelectItem>
                    <SelectItem value="grass">Grass</SelectItem>
                    <SelectItem value="sand">Sand</SelectItem>
                    <SelectItem value="indoor">Indoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gender Category</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="mens">Men's</SelectItem>
                    <SelectItem value="womens">Women's</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g. Tennis Club Downtown, NYC" />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h3 className="font-bold text-foreground">Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max-players">Max Participants</Label>
                <Input id="max-players" type="number" placeholder="16" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fee">Entry Fee (optional)</Label>
                <Input id="fee" placeholder="$0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prizes">Prize / Awards (optional)</Label>
              <Textarea id="prizes" placeholder="1st place trophy, 2nd place medal..." rows={2} />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h3 className="font-bold text-foreground">Settings</h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-foreground">Public Tournament</p>
                <p className="text-xs text-muted-foreground">Anyone can find and join</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-foreground">Allow Self-Registration</p>
                <p className="text-xs text-muted-foreground">Players can register themselves</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-foreground">Third-Place Match</p>
                <p className="text-xs text-muted-foreground">Play a match for 3rd place</p>
              </div>
              <Switch />
            </div>
          </div>

          <Button variant="hero" className="w-full h-14 text-base" type="button">
            <Trophy size={20} />
            Create Tournament
          </Button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CreateTournament;
