import Link from 'next/link';
import { Twitter, Github, Linkedin, Mail, Heart, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t bg-gradient-to-b from-background via-background/95 to-background/90 py-9">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="container relative px-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left side - Branding */}
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Interview Hub
              </h2>
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A clean and modern platform to share your ideas, stories, and experiences with the world.
              Built for writers, thinkers, and creatives.
            </p>
          </div>

          {/* Right side - Social links and Copyright */}
          <div className="flex flex-col items-end gap-6">
            <div className="flex gap-6">
              <Link
                href="https://x.com/uttamseerviii"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label="Twitter"
              >
                <div className="absolute -inset-2 rounded-full bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-300" />
                <div className="absolute -inset-2 rounded-full bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300 delay-75" />
                <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors relative group-hover:scale-110 duration-300" />
              </Link>
              <Link
                href="https://github.com/uttamseervi/Mind-Dump"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label="GitHub"
              >
                <div className="absolute -inset-2 rounded-full bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-300" />
                <div className="absolute -inset-2 rounded-full bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300 delay-75" />
                <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors relative group-hover:scale-110 duration-300" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/uttam-seervi-8500032ab/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label="LinkedIn"
              >
                <div className="absolute -inset-2 rounded-full bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-300" />
                <div className="absolute -inset-2 rounded-full bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300 delay-75" />
                <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors relative group-hover:scale-110 duration-300" />
              </Link>
              <Link
                href="mailto:uttamseerviii@gmail.com"
                className="group relative"
                aria-label="Email"
              >
                <div className="absolute -inset-2 rounded-full bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-300" />
                <div className="absolute -inset-2 rounded-full bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300 delay-75" />
                <Mail className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors relative group-hover:scale-110 duration-300" />
              </Link>
            </div>

            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>by</span>
              <span className="font-medium bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Uttam Seervi
              </span>
              <span className="text-primary">&copy; {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
