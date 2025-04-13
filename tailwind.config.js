/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	fontSize: {
  		xs: '0.75rem',
  		sm: '0.875rem',
  		base: '1rem',
  		lg: '1.125rem',
  		xl: '1.25rem',
  		'2xl': '1.5rem',
  		'3xl': '1.875rem',
  		'4xl': '2.25rem',
  		'5xl': '3rem',
  		'6xl': '4rem'
  	},
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
				// DEFAULT: '#0BDA51',
				// foreground: '#0BDA51'
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			// gray: colors.gray,
			gray: '#eeeeee',
			customGray: {
				50: '#f9f9f9',
				100: '#f0f0f0',
				200: '#e0e0e0',
				300: '#cfcfcf',
				400: '#bfbfbf',
				500: '#a0a0a0',
				600: '#808080',
				700: '#606060',
				800: '#404040',
				900: '#202020',
			  },
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require('@tailwindcss/forms'), require("tailwindcss-animate")], // eslint-disable-line
};
