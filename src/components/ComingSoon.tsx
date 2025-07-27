// import { EmailSignup } from '@/components/EmailSignup';
// import { SocialLinks } from '@/components/SocialLinks';

const ComingSoon = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Simple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-primary" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-foreground">
              Our Blog is Almost Here!
              {/* <span className="block bg-gradient-to-r from-white to-primary-foreground bg-clip-text text-transparent">
                Soon
              </span> */}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-1000" />
      </div>
    </div>
  );
};

export default ComingSoon;
