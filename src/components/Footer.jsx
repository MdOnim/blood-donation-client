import { Link } from 'react-router-dom';
import { FaHeart, FaPhone, FaEnvelope, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                <FaHeart className="text-white text-sm" />
              </div>
              <span className="font-heading text-xl font-bold">LifeLink</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connecting blood donors with those in need. Together, we save lives across Bangladesh.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/donation-requests" className="hover:text-white transition-colors">Donation Requests</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Search Donors</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <FaPhone className="text-primary-light" />
                +880 1712-345678
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-primary-light" />
                support@lifelink.bd
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">Follow Us</h4>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FaXTwitter size={20} />
              <span className="text-sm">@LifeLinkBD</span>
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} LifeLink Blood Donation Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
