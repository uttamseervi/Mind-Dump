import Link from 'next/link';
import MindDumpLogo from './logo';

export function Footer() {
  return (
    <footer className="border-t bg-background py-8">
      <div className="container px-4 space-y-6 text-center md:text-left">
        {/* About the App */}
        <div>
          {/* <MindDumpLogo /> */}
          <p className="text-sm text-muted-foreground max-w-md mx-auto md:mx-0">
            A clean and modern platform to share your ideas, stories, and experiences with the world.
            Built for writers, thinkers, and creatives.
          </p>
        </div>

        {/* Contact & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Uttam Seervi —{' '}
            <a
              href="mailto:uttamseerviii@gmail.com"
              className="hover:text-primary underline"
            >
              uttamseerviii@gmail.com
            </a>
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              GitHub
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
