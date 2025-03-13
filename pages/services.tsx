import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  FaUtensils, FaSwimmingPool, FaCar, FaWifi, FaCocktail, 
  FaUmbrellaBeach, FaSnowflake, FaBed, FaSpa, FaShuttleVan, 
  FaShoppingBag, FaGlassCheers, FaMusic, FaBiking,
  FaChild, FaShieldAlt, FaGift, FaHandsWash, FaUtensilSpoon
} from 'react-icons/fa';
import { GiMeditation } from 'react-icons/gi';
import { useInView } from 'react-intersection-observer';
import ClientOnly from '../components/ClientOnly';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  color: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, index, color }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`${color} rounded-lg p-6 shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm relative overflow-hidden ${inView ? 'animate-fadeIn opacity-100' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 bg-white blur-lg"></div>
      <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-white/40 to-transparent"></div>
      <div className="text-4xl mb-4 text-white">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-white/90">{description}</p>
    </div>
  );
};

interface BubbleProps {
  delay: number;
  size: number;
  left: string;
  duration: number;
}

const FloatingBubble = ({ delay, size, left, duration }: BubbleProps) => {
  return (
    <div 
      className="absolute rounded-full bg-white/10 backdrop-blur-md"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        left: left,
        bottom: "-100px",
        animation: `float ${duration}s linear infinite ${delay}s`,
      }}
    />
  );
};

const BubbleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <ClientOnly>
        <>
          <FloatingBubble delay={0} size={30} left="10%" duration={15} />
          <FloatingBubble delay={2} size={50} left="25%" duration={20} />
          <FloatingBubble delay={5} size={25} left="40%" duration={18} />
          <FloatingBubble delay={7} size={40} left="60%" duration={22} />
          <FloatingBubble delay={10} size={35} left="75%" duration={19} />
          <FloatingBubble delay={12} size={45} left="90%" duration={21} />
          <FloatingBubble delay={3} size={20} left="15%" duration={16} />
          <FloatingBubble delay={8} size={55} left="50%" duration={23} />
          <FloatingBubble delay={13} size={25} left="80%" duration={17} />
          <FloatingBubble delay={1} size={35} left="30%" duration={19} />
        </>
      </ClientOnly>
    </div>
  );
};

export default function Services() {
  const services = [
    {
      icon: <FaUtensils />,
      title: "Private Chef Service",
      description: "Enjoy gourmet meals prepared by our professional chef using local ingredients and international techniques.",
      color: "bg-gradient-to-br from-amber-500 to-orange-600"
    },
    {
      icon: <FaSpa />,
      title: "In-Villa Spa Treatments",
      description: "Relax with professional spa services including massages, facials, and wellness treatments in the comfort of your villa.",
      color: "bg-gradient-to-br from-purple-500 to-indigo-600"
    },
    {
      icon: <FaShuttleVan />,
      title: "Airport Transfers",
      description: "Complimentary luxury airport pickup and drop-off service for a seamless travel experience.",
      color: "bg-gradient-to-br from-gray-700 to-gray-900"
    },
    {
      icon: <FaCar />,
      title: "Private Vehicle Rental",
      description: "Explore Goa at your own pace with our premium vehicle rental service with or without a chauffeur.",
      color: "bg-gradient-to-br from-blue-400 to-blue-600"
    },
    {
      icon: <FaSwimmingPool />,
      title: "Pool Maintenance",
      description: "Daily cleaning and maintenance of your private infinity pool for a perfect swimming experience.",
      color: "bg-gradient-to-br from-cyan-400 to-teal-500"
    },
    {
      icon: <FaUmbrellaBeach />,
      title: "Beach Setup",
      description: "Private beach access with setup of loungers, umbrellas, and refreshments for a perfect day by the sea.",
      color: "bg-gradient-to-br from-yellow-400 to-yellow-600"
    },
    {
      icon: <FaShoppingBag />,
      title: "Grocery Delivery",
      description: "Pre-arrival and on-demand grocery shopping service to stock your villa with your preferred items.",
      color: "bg-gradient-to-br from-green-500 to-green-700"
    },
    {
      icon: <FaGlassCheers />,
      title: "Bar & Mixology",
      description: "Professional bartender service for private parties with signature cocktails and premium spirits.",
      color: "bg-gradient-to-br from-red-500 to-pink-600"
    },
    {
      icon: <FaHandsWash />,
      title: "Daily Housekeeping",
      description: "Comprehensive daily cleaning service to maintain your villa in perfect condition throughout your stay.",
      color: "bg-gradient-to-br from-blue-500 to-violet-500"
    },
    {
      icon: <FaMusic />,
      title: "Entertainment System",
      description: "State-of-the-art sound system and smart TV with streaming services for your entertainment needs.",
      color: "bg-gradient-to-br from-pink-500 to-rose-600"
    },
    {
      icon: <GiMeditation />,
      title: "Yoga & Fitness",
      description: "Private yoga and fitness sessions with certified instructors in your villa or on the beach.",
      color: "bg-gradient-to-br from-emerald-400 to-green-600"
    },
    {
      icon: <FaWifi />,
      title: "High-Speed WiFi",
      description: "Complimentary high-speed fiber internet throughout the property for seamless connectivity.",
      color: "bg-gradient-to-br from-indigo-400 to-purple-500"
    },
    {
      icon: <FaBiking />,
      title: "Bicycle Rental",
      description: "Explore the local area with our complimentary bicycle rental service for villa guests.",
      color: "bg-gradient-to-br from-amber-400 to-orange-500"
    },
    {
      icon: <FaChild />,
      title: "Childcare Services",
      description: "Professional babysitting and childcare services available upon request for your peace of mind.",
      color: "bg-gradient-to-br from-sky-400 to-blue-500"
    },
    {
      icon: <FaGift />,
      title: "Surprise Celebrations",
      description: "Special occasion decoration and surprise arrangements for birthdays, anniversaries, or proposals.",
      color: "bg-gradient-to-br from-fuchsia-500 to-purple-600"
    },
    {
      icon: <FaShieldAlt />,
      title: "24/7 Security",
      description: "Round-the-clock security personnel and advanced surveillance systems for your safety.",
      color: "bg-gradient-to-br from-slate-600 to-slate-800"
    },
    {
      icon: <FaUtensilSpoon />,
      title: "Breakfast Included",
      description: "Complimentary gourmet breakfast prepared daily with fresh local ingredients and international options.",
      color: "bg-gradient-to-br from-amber-600 to-orange-700"
    },
    {
      icon: <FaCocktail />,
      title: "Welcome Package",
      description: "Arrival welcome package with refreshments, local treats, and information about your stay.",
      color: "bg-gradient-to-br from-rose-400 to-red-500"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900 relative">
      <Head>
        <title>Luxury Services | KBM Resorts Villa #981</title>
        <meta name="description" content="Explore the premium services offered at our luxury villa in KBM Resorts, Goa. From private chefs to beach setups, we cater to your every need." />
      </Head>
      
      <style jsx global>{`
        @keyframes float {
          0% { 
            transform: translate(0, 0);
            opacity: 0.7;
          }
          50% { 
            transform: translate(calc(25px - 50px * Math.random()), -50vh);
            opacity: 0.5;
          }
          100% { 
            transform: translate(calc(25px - 50px * Math.random()), -100vh);
            opacity: 0;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
      
      <BubbleBackground />
      
      <div className="relative z-10">
        <header className="py-6 relative z-10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-white text-2xl font-bold tracking-wider">
                CASA ROYAL
              </Link>
              <Link href="/">
                <button className="px-5 py-2 backdrop-blur-sm bg-white/10 rounded-full text-white border border-white/20 hover:bg-white/20 transition-colors">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight opacity-0 animate-fadeIn" style={{ animationDelay: "100ms" }}>
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
                Exclusive Villa Services
              </span>
            </h1>
            
            <p className="text-xl text-primary-100 opacity-0 animate-fadeIn" style={{ animationDelay: "300ms" }}>
              Experience unparalleled luxury with our comprehensive range of premium services designed to make your stay at KBM Resorts Villa #981 truly extraordinary.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                index={index}
                color={service.color}
              />
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <div className="opacity-0 animate-fadeIn" style={{ animationDelay: "1000ms" }}>
              <Link href="/booking">
                <button className="px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full text-white text-lg font-semibold hover:from-accent-600 hover:to-accent-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-500/30">
                  Book Your Luxury Experience Now
                </button>
              </Link>
            </div>
          </div>
        </main>
        
        <footer className="py-8 border-t border-primary-700/50 mt-20">
          <div className="container mx-auto px-4 text-center text-primary-300">
            <p>© {new Date().getFullYear()} KBM Resorts Villa #981. All rights reserved.</p>
            <p className="mt-2 text-sm">
              Located at: Colony Villas at Waikoloa CVW-306 69-555 Waikoloa Beach Drive Waikoloa, Waikoloa, Kona, Big Island, Hawaii, United States
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
} 