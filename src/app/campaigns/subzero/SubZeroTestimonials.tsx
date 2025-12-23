'use client';

const testimonials = [
  {
    id: 1,
    name: 'Ciyo',
    role: 'Keeper, Pahang Rangers',
    quote:
      'Walaupun saya keeper, shooting rasa sedap dan ringan. Senang nak split.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Emir',
    role: 'Casual Player',
    quote:
      'Honestly, toe-poking feels great and this shoe is surpisingly lighter than it looks',
    rating: 5,
  },
  {
    id: 3,
    name: 'Coach Faiq',
    role: 'Nottingham University Futsal Head Coach ',
    quote:
      'Serious tak expect untuk kasut ni rasa macam brand-brand kat luar sana.',
    rating: 5,
  },
];

const SubZeroTestimonials = () => {
  return (
    <section className="bg-gradient-to-br from-[#0a1f3d] via-[#0d3d5c] to-[#1a5a7a] py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 text-center sm:mb-10 md:mb-12">
          <h2 className="mb-3 text-3xl font-bold italic text-white sm:mb-4 sm:text-4xl md:text-5xl">
            WHAT PLAYERS SAY
          </h2>
          <p className="text-base text-[#4FD1C5] sm:text-lg md:text-xl">
            Real feedback from real players
          </p>
        </div>

        {/* Testimonials Grid - Stack on mobile, 3 columns on desktop */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group relative overflow-hidden rounded-lg bg-white/10 p-5 backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-xl sm:p-6"
            >
              {/* Rating Stars */}
              <div className="mb-3 flex gap-1 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="size-4 text-[#4FD1C5] sm:size-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-4 text-sm text-white sm:mb-6 sm:text-base">
                &quot;{testimonial.quote}&quot;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative size-10 overflow-hidden rounded-full bg-white/20 sm:size-12">
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#4FD1C5] to-[#0a1f3d] text-lg font-bold text-white sm:text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white sm:text-base">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-[#4FD1C5] sm:text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubZeroTestimonials;
