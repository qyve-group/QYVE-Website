// import { EmailSignup } from '@/components/EmailSignup';
// import { SocialLinks } from '@/components/SocialLinks';

const ComingSoon = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Simple Gradient Background */}
      <div className="bg-gradient-primary absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="animate-fade-in mx-auto max-w-4xl space-y-12">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="sm:text-7xl lg:text-8xl text-5xl font-bold text-foreground">
              Our Blog is Almost Here!
              {/* <span className="block bg-gradient-to-r from-white to-primary-foreground bg-clip-text text-transparent">
                Soon
              </span> */}
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground sm:text-2xl">
              We are working on something worth reading. Stay tuned.
            </p>
          </div>

          {/* <div className="py-8">
            <h3 className="text-xl font-medium text-foreground mb-6">
              Get Early Access
            </h3>
            <EmailSignup />
          </div>

          <div className="py-8">
            <h4 className="text-lg font-medium text-foreground mb-6">
              Follow Our Journey
            </h4>
            <SocialLinks />
          </div> */}

          {/* Footer */}
          {/* <div className="pt-12 pb-8">
            <p className="text-sm text-muted-foreground">
              © 2024 Your Company. Building the future, one pixel at a time.
            </p>
          </div> */}
        </div>
      </div>

      {/* Subtle Floating Orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 size-24 animate-pulse rounded-full bg-white/10 blur-xl" />
        <div className="absolute right-1/4 top-3/4 size-16 animate-pulse rounded-full bg-white/5 blur-lg delay-1000" />
      </div>
    </div>
  );
};

export default ComingSoon;
