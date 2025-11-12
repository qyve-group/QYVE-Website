'use client';

const testimonials = [
  {
    id: 1,
    name: 'Ahmad Haziq',
    role: 'Futsal Player',
    quote:
      'The grip is insane! I can make quick cuts and stops without any slipping. Best futsal shoes I\'ve owned.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Fariz Rahman',
    role: 'Semi-Pro Player',
    quote:
      'Lightweight and breathable. My feet stay cool even during intense matches. The energy return is noticeable.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Daniel Tan',
    role: 'Weekend Warrior',
    quote:
      'Worth every ringgit! The build quality is exceptional and they look absolutely stunning on court.',
    rating: 5,
  },
];

const SubZeroTestimonials = () => {
  return (
    <section className="bg-gradient-to-br from-[#0a1f3d] via-[#0d3d5c] to-[#1a5a7a] py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold italic text-white md:text-5xl">
            WHAT PLAYERS SAY
          </h2>
          <p className="text-[#4FD1C5] text-lg md:text-xl">
            Real feedback from real players
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group relative overflow-hidden rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-xl"
            >
              {/* Rating Stars */}
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="text-[#4FD1C5] size-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-6 text-white">
                &quot;{testimonial.quote}&quot;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative size-12 overflow-hidden rounded-full bg-white/20">
                  {/* Placeholder for user image */}
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#4FD1C5] to-[#0a1f3d] text-xl font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-[#4FD1C5] text-sm">
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
