import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaSearch, FaHandHoldingHeart, FaUsers, FaTint } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: FaTint,
      title: 'Find Blood Fast',
      description: 'Search donors by blood group and location to find the right match quickly.',
    },
    {
      icon: FaUsers,
      title: 'Community Driven',
      description: 'Join thousands of donors across Bangladesh making a real difference every day.',
    },
    {
      icon: FaHandHoldingHeart,
      title: 'Support the Cause',
      description: 'Contribute funds to help our organization reach more people in need.',
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-secondary text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <FaHeart className="text-accent animate-pulse" />
              <span className="text-accent font-medium text-sm tracking-wider uppercase">
                Save Lives Today
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-6">
              Every Drop Counts.<br />
              <span className="text-accent">Be a Hero.</span>
            </h1>
            <p className="text-white/80 text-lg mb-10 leading-relaxed max-w-xl">
              LifeLink connects blood donors with patients in critical need across Bangladesh.
              Register today and become part of a life-saving community.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary bg-white text-primary hover:bg-cream hover:text-primary-dark">
                Join as a Donor
              </Link>
              <Link to="/search" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
                <span className="flex items-center gap-2">
                  <FaSearch /> Search Donors
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Why Choose LifeLink?
            </h2>
            <p className="text-muted dark:text-gray-400 max-w-2xl mx-auto">
              We make blood donation simple, fast, and accessible for everyone in Bangladesh.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="card text-center hover:shadow-lg transition-shadow group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="text-primary text-2xl" />
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">{feature.title}</h3>
                <p className="text-muted dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream dark:bg-[#0f1419] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-muted dark:text-gray-400 leading-relaxed mb-8">
                One blood donation can save up to three lives. Join our growing community of
                heroes and help us build a healthier Bangladesh together.
              </p>
              <Link to="/register" className="btn-primary inline-block">
                Get Started Now
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '10K+', label: 'Registered Donors' },
                { num: '5K+', label: 'Lives Saved' },
                { num: '64', label: 'Districts Covered' },
                { num: '24/7', label: 'Support Available' },
              ].map((stat) => (
                <div key={stat.label} className="card text-center">
                  <p className="font-heading text-3xl font-bold text-primary mb-1">{stat.num}</p>
                  <p className="text-muted dark:text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Contact Us
            </h2>
            <p className="text-muted dark:text-gray-400">Have questions? We&apos;d love to hear from you.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for your message! We will get back to you soon.');
              }}
              className="card space-y-4"
            >
              <input type="text" placeholder="Your Name" className="input-field" required />
              <input type="email" placeholder="Your Email" className="input-field" required />
              <textarea placeholder="Your Message" rows={5} className="input-field resize-none" required />
              <button type="submit" className="btn-primary w-full">Send Message</button>
            </form>
            <div className="flex flex-col justify-center space-y-6">
              <div className="card">
                <h3 className="font-heading font-bold text-lg mb-2 dark:text-gray-100">Phone</h3>
                <p className="text-primary font-semibold text-xl">+880 1712-345678</p>
              </div>
              <div className="card">
                <h3 className="font-heading font-bold text-lg mb-2 dark:text-gray-100">Email</h3>
                <p className="text-muted dark:text-gray-400">support@lifelink.bd</p>
              </div>
              <div className="card">
                <h3 className="font-heading font-bold text-lg mb-2 dark:text-gray-100">Office Hours</h3>
                <p className="text-muted dark:text-gray-400">Sunday - Thursday: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
