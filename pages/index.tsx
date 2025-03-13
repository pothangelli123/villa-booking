import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaSwimmingPool, FaBed, FaBath, FaWifi, FaCar, FaSnowflake, FaUtensils, FaTv, FaMountain, FaArrowRight, FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaStar } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Import regular components
import Button from '../components/Button';
import GlassmorphicCard from '../components/GlassmorphicCard';
import AnimatedText from '../components/AnimatedText';
import ClientOnly from '../components/ClientOnly';

// Dynamically import components with SSR issues
const DynamicImageCarousel = dynamic(() => import('../components/ImageCarousel'), { 
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
      <p className="text-gray-500">Loading image gallery...</p>
    </div>
  )
});

const DynamicParallaxSection = dynamic(() => import('../components/ParallaxSection'), { ssr: false });

// Import motion components only on client-side
const MotionComponents = dynamic(() => 
  import('framer-motion').then((mod) => ({
    motion: mod.motion,
    useScroll: mod.useScroll, 
    useTransform: mod.useTransform
  })),
  { ssr: false }
);

// Import GSAP only on client-side
const GsapComponents = dynamic(() => 
  import('gsap').then((mod) => {
    // Import ScrollTrigger
    return import('gsap/dist/ScrollTrigger').then((ScrollTriggerMod) => {
      const gsap = mod.default;
      const { ScrollTrigger } = ScrollTriggerMod;
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    });
  }),
  { ssr: false }
);

// Define types for our villa data
interface Amenity {
  icon: React.ReactNode;
  name: string;
}

interface VillaData {
  name: string;
  location: string;
  description: string;
  shortDescription: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: Amenity[];
  images: string[];
}

// KBM Resorts Villa data
const villaData: VillaData = {
  name: "Casa Royal Villa at KBM Resorts",
  location: "KBM Resorts, Goa, India",
  description: `This stunning beachfront villa offers breathtaking ocean views and unparalleled luxury. Located at KBM Resorts (property #981), this magnificent property is perfect for families, couples, or friend groups looking for an exceptional vacation experience.

  The villa boasts 4 lavish bedrooms, each with its own en-suite bathroom, a fully equipped gourmet kitchen, and multiple living areas perfect for both entertaining and relaxation. Step outside to your private infinity pool that seemingly merges with the ocean horizon, surrounded by meticulously landscaped gardens.

  Whether you're watching the sunset from your private terrace, enjoying a meal prepared by our optional private chef service, or taking a short stroll to the beach, this villa offers the ultimate luxury retreat for discerning travelers.`,
  shortDescription: "Luxurious 4-bedroom beachfront villa with private pool and stunning ocean views.",
  price: 35000,
  bedrooms: 4,
  bathrooms: 4,
  maxGuests: 8,
  amenities: [
    { icon: <FaSwimmingPool />, name: "Private Infinity Pool" },
    { icon: <FaBed />, name: "4 Luxury Bedrooms" },
    { icon: <FaBath />, name: "4 En-suite Bathrooms" },
    { icon: <FaWifi />, name: "High-speed WiFi" },
    { icon: <FaCar />, name: "Free Parking" },
    { icon: <FaSnowflake />, name: "Air Conditioning" },
    { icon: <FaUtensils />, name: "Gourmet Kitchen" },
    { icon: <FaTv />, name: "Smart TVs" },
    { icon: <FaMountain />, name: "Ocean Views" }
  ],
  images: [
    // Use placeholder images from Placeholder.com that will work right away
    "https://via.placeholder.com/1200x800.png?text=Villa+Exterior",
    "https://via.placeholder.com/1200x800.png?text=Villa+Interior",
    "https://via.placeholder.com/1200x800.png?text=Villa+Bedroom",
    "https://via.placeholder.com/1200x800.png?text=Villa+Bathroom",
    "https://via.placeholder.com/1200x800.png?text=Villa+Pool"
  ]
};

// Client-side Hero animations component
const HeroAnimations = ({ children }) => {
  const heroRef = useRef(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // We'll import and use GSAP only in useEffect to avoid SSR issues
    import('gsap').then((gsapModule) => {
      import('gsap/dist/ScrollTrigger').then((scrollModule) => {
        const gsap = gsapModule.default;
        const { ScrollTrigger } = scrollModule;
        gsap.registerPlugin(ScrollTrigger);
        
        // Create timeline for the hero section
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
        
        heroTl.to('.hero-content', {
          y: 100,
          opacity: 0.5,
          ease: 'power2.in'
        });
      });
    });
    
    // Clean up ScrollTrigger on component unmount
    return () => {
      import('gsap/dist/ScrollTrigger').then((scrollModule) => {
        const { ScrollTrigger } = scrollModule;
        ScrollTrigger.getAll().forEach(t => t.kill());
      });
    };
  }, []);
  
  return (
    <div ref={heroRef} className="relative h-screen">
      {children}
    </div>
  );
};

export default function Home() {
  // Use a simple string for the title, not JSX or an array
  const pageTitle = `${villaData.name} | Direct Booking`;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-white overflow-hidden">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={villaData.shortDescription} />
      </Head>

      {/* Hero Section */}
      <ClientOnly>
        <HeroAnimations>
          <DynamicParallaxSection
            backgroundImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            overlayColor="from-primary-900/70 to-secondary-900/70"
            height="h-screen"
            speed={0.5}
          >
            <div className="hero-content container max-w-6xl mx-auto h-full flex flex-col items-center justify-center text-white text-center px-4">
              <AnimatedText
                text={villaData.name}
                tag="h1"
                type="words"
                animation="fadeInUp"
                staggerChildren={0.08}
                className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg"
              />
              
              <ClientOnly>
                <AnimatedText
                  text={villaData.shortDescription}
                  tag="p"
                  animation="fadeIn"
                  delay={0.8}
                  className="text-xl md:text-2xl max-w-3xl mb-12 text-gray-100 drop-shadow-md"
                />
              </ClientOnly>
              
              <ClientOnly>
                {() => {
                  const { motion } = require('framer-motion');
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                    >
                      <Button 
                        variant="primary" 
                        size="lg"
                        icon={<FaArrowRight />}
                        iconPosition="right"
                        className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                      >
                        Book Now
                      </Button>
                    </motion.div>
                  );
                }}
              </ClientOnly>
            </div>
          </DynamicParallaxSection>

          <ClientOnly>
            {() => {
              const { motion } = require('framer-motion');
              return (
                <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                  <motion.div 
                    className="cursor-pointer"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <a href="#villa-details">
                      <svg className="w-10 h-10 text-white filter drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </a>
                  </motion.div>
                </div>
              );
            }}
          </ClientOnly>
        </HeroAnimations>
      </ClientOnly>

      {/* Villa Details Section */}
      <section id="villa-details" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 z-0"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-100 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <ClientOnly>
              <AnimatedText
                text="Welcome to KBM Resorts Villa #981"
                tag="h2"
                type="words"
                animation="fadeIn"
                className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text"
              />
            </ClientOnly>
            
            <ClientOnly>
              <AnimatedText
                text="Experience luxury and comfort in this beautiful beachfront villa available for direct booking.
                This property is showcased on KBM Resorts."
                type="lines"
                animation="fadeIn"
                delay={0.4}
                className="text-lg max-w-4xl mx-auto text-gray-700"
                tag="p"
              />
            </ClientOnly>
          </div>
          
          {/* Villa Features */}
          <ClientOnly>
            {() => {
              const { motion, useScroll, useTransform } = require('framer-motion');
              const featuresRef = useRef(null);
              const { scrollYProgress } = useScroll();
              const featuresY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
              
              return (
                <motion.div 
                  ref={featuresRef}
                  style={{ y: featuresY }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
                >
                  <GlassmorphicCard 
                    animation="fadeInLeft"
                    delay={0.2} 
                    className="p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <FaBed className="text-primary-600 text-3xl mr-3" />
                      <h3 className="text-xl font-bold">{villaData.bedrooms} Bedrooms</h3>
                    </div>
                    <p className="text-gray-600">Spacious, luxurious bedrooms with premium linens and amenities.</p>
                  </GlassmorphicCard>
                  
                  <GlassmorphicCard 
                    animation="fadeInUp"
                    delay={0.4} 
                    className="p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <FaBath className="text-primary-600 text-3xl mr-3" />
                      <h3 className="text-xl font-bold">{villaData.bathrooms} Bathrooms</h3>
                    </div>
                    <p className="text-gray-600">Modern en-suite bathrooms with premium fixtures and amenities.</p>
                  </GlassmorphicCard>
                  
                  <GlassmorphicCard 
                    animation="fadeInRight"
                    delay={0.6} 
                    className="p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <FaSwimmingPool className="text-primary-600 text-3xl mr-3" />
                      <h3 className="text-xl font-bold">Private Pool</h3>
                    </div>
                    <p className="text-gray-600">Enjoy your own private swimming pool with panoramic views.</p>
                  </GlassmorphicCard>
                </motion.div>
              );
            }}
          </ClientOnly>
          
          <div className="mt-12 text-center">
            <ClientOnly>
              {() => {
                const { motion } = require('framer-motion');
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Button
                      href="/booking"
                      variant="primary"
                      size="lg"
                      className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Book Your Stay
                    </Button>
                  </motion.div>
                );
              }}
            </ClientOnly>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-primary-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-secondary-100 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <ClientOnly>
              <AnimatedText
                text="Villa Gallery"
                tag="h2"
                animation="slideUp"
                className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text"
              />
            </ClientOnly>
          </div>
          
          <GlassmorphicCard 
            animation="fadeIn"
            delay={0.3}
            className="p-6 mb-8 shadow-xl"
          >
            <ClientOnly>
              <DynamicImageCarousel 
                images={[
                  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                  "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                  "https://images.unsplash.com/photo-1554967665-10343ae87a13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                ]}
                showThumbs={true}
                height="h-[600px]"
              />
            </ClientOnly>
          </GlassmorphicCard>
          
          <div className="mt-10 text-center">
            <AnimatedText
              text="Images are placeholders. Visit KBM Resorts to see the actual villa photos."
              tag="p"
              animation="fadeIn"
              delay={0.5}
              className="text-gray-600 italic"
            />
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section id="description" className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 z-0"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-100 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container max-w-4xl mx-auto px-4 relative z-10">
          <AnimatedText
            text="About This Villa"
            tag="h2"
            animation="slideUp"
            className="text-3xl md:text-4xl font-bold mb-10 bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text"
          />
          
          <GlassmorphicCard 
            animation="fadeIn"
            delay={0.3}
            hoverEffect={false}
            className="p-8 mb-12 shadow-xl"
          >
            <div className="prose max-w-none">
              <ClientOnly>
                {() => {
                  const { motion } = require('framer-motion');
                  return (
                    <>
                      {villaData.description.split('\n\n').map((paragraph, idx) => (
                        <motion.p 
                          key={idx} 
                          className="mb-4 text-gray-700 leading-relaxed"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * idx, duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </>
                  );
                }}
              </ClientOnly>
            </div>
          </GlassmorphicCard>
            
          <div className="mb-12">
            <AnimatedText
              text="Amenities"
              tag="h3"
              animation="slideUp"
              className="text-2xl font-bold mb-6 text-primary-700"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <ClientOnly>
                {() => {
                  const { motion } = require('framer-motion');
                  return (
                    <>
                      {villaData.amenities.map((amenity, idx) => (
                        <motion.div 
                          key={idx} 
                          className="flex items-center p-3 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx, duration: 0.4 }}
                          viewport={{ once: true }}
                        >
                          <div className="text-primary-600 mr-3 text-xl">
                            {amenity.icon}
                          </div>
                          <span className="text-gray-700">{amenity.name}</span>
                        </motion.div>
                      ))}
                    </>
                  );
                }}
              </ClientOnly>
            </div>
          </div>
          
          <GlassmorphicCard
            animation="zoomIn"
            delay={0.5}
            className="p-8 bg-gradient-to-br from-primary-50 to-secondary-50 mb-8 shadow-xl border border-primary-100 relative overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary-200 rounded-full opacity-20 blur-xl"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 text-primary-700">Pricing</h3>
              <div className="flex items-baseline">
                <AnimatedText
                  text={`₹${villaData.price.toLocaleString()}`}
                  tag="span"
                  animation="fadeIn"
                  className="text-4xl font-bold text-primary-600"
                />
                <span className="ml-2 text-gray-600">/ night</span>
              </div>
              <p className="mt-2 text-gray-600">Direct booking price - no extra fees or commissions!</p>
              
              <div className="mt-6">
                <Button
                  href="/booking"
                  variant="primary"
                  size="md"
                  icon={<FaArrowRight />}
                  iconPosition="right"
                  className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <ClientOnly>
        <DynamicParallaxSection
          backgroundImage="https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          overlayColor="from-primary-900/70 to-accent-900/70"
          height="min-h-[500px]"
          speed={0.3}
          fadeIn={true}
        >
          <div className="container max-w-4xl mx-auto py-20 px-4 text-center relative z-10">
            <AnimatedText
              text="What Our Guests Say"
              tag="h2"
              animation="fadeIn"
              className="text-3xl md:text-4xl font-bold mb-12 text-white drop-shadow-lg"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassmorphicCard
                animation="fadeInLeft"
                delay={0.3}
                className="p-6 backdrop-blur-md bg-white/10 border border-white/20 shadow-xl"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl font-bold">S</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Sarah & Michael</p>
                    <p className="text-white/70 text-sm">London, UK</p>
                  </div>
                </div>
                <p className="text-white mb-4">"Our stay at Casa Royal Villa was absolutely magical. The infinity pool overlooking the ocean was a dream come true. We'll definitely be back!"</p>
                <div className="flex text-yellow-400 mt-2">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </GlassmorphicCard>
              
              <GlassmorphicCard
                animation="fadeInRight"
                delay={0.5}
                className="p-6 backdrop-blur-md bg-white/10 border border-white/20 shadow-xl"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl font-bold">P</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Priya & Raj</p>
                    <p className="text-white/70 text-sm">Mumbai, India</p>
                  </div>
                </div>
                <p className="text-white mb-4">"The best vacation rental we've ever experienced. Immaculate property, stunning views, and exceptional service from the villa staff."</p>
                <div className="flex text-yellow-400 mt-2">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </GlassmorphicCard>
            </div>
          </div>
        </DynamicParallaxSection>
      </ClientOnly>
      
      {/* Footer */}
      <footer className="bg-primary-900 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">KBM Resorts</h3>
              <p className="text-gray-300 mb-4">Experience luxury accommodations at our beautiful beachfront properties.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-primary-300 transition-colors">
                  <FaFacebookF />
                </a>
                <a href="#" className="text-white hover:text-primary-300 transition-colors">
                  <FaInstagram />
                </a>
                <a href="#" className="text-white hover:text-primary-300 transition-colors">
                  <FaTwitter />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                <li><a href="#villa-details" className="text-gray-300 hover:text-white transition-colors">Villa Details</a></li>
                <li><a href="#gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</a></li>
                <li><a href="#description" className="text-gray-300 hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300">
                  <FaMapMarkerAlt className="mr-2" /> KBM Resorts, Goa, India
                </li>
                <li className="flex items-center text-gray-300">
                  <FaPhone className="mr-2" /> +91 123 456 7890
                </li>
                <li className="flex items-center text-gray-300">
                  <FaEnvelope className="mr-2" /> info@kbmresorts.com
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-300 mb-4">Subscribe for special offers and updates</p>
              <div className="flex">
                <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-800" />
                <button className="bg-primary-600 hover:bg-primary-700 transition-colors px-4 py-2 rounded-r-md">
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} KBM Resorts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 