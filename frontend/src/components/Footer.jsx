import { Facebook, Twitter, Instagram, Github } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-gray-900">FoodHub</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Delivering happiness one meal at a time. Experience artisanal cuisine from your favorite local chefs.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Follow us on Facebook" className="text-gray-400 hover:text-orange-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Follow us on Twitter" className="text-gray-400 hover:text-orange-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Follow us on Instagram" className="text-gray-400 hover:text-orange-600 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-500 hover:text-orange-600 text-sm transition-colors block py-2">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-500 hover:text-orange-600 text-sm transition-colors block py-2">Careers</Link></li>
              <li><Link to="/blog" className="text-gray-500 hover:text-orange-600 text-sm transition-colors block py-2">Our Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/help" className="text-gray-500 hover:text-orange-600 text-sm transition-colors block py-2">Help Center</Link></li>
              <li><Link to="/safety" className="text-gray-500 hover:text-orange-600 text-sm transition-colors block py-2">Safety</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-orange-600 text-sm transition-colors block py-2">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-gray-500 hover:text-orange-600 text-sm transition-colors block py-2">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-gray-500 hover:text-orange-600 text-sm transition-colors block py-2">Cookies Policy</Link></li>
              <li><Link to="/compliance" className="text-gray-500 hover:text-orange-600 text-sm transition-colors block py-2">Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs font-medium">
            © {new Date().getFullYear()} FoodHub Technologies Inc. All rights reserved.
          </p>
          <div className="flex gap-8">
            <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Made with ❤️ for foodies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
