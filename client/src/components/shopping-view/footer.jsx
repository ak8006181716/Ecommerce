import { HousePlug, Mail, ShieldCheck, Truck, Phone, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function ShoppingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 w-full pt-16 pb-12 mt-auto">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/shop/home" className="flex items-center gap-2.5 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-lg">
                <HousePlug className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                SmartWear
              </span>
            </Link>
            <p className="text-slate-400 text-sm font-light max-w-sm leading-relaxed">
              Your premier destination for high-end fashion, designer apparel, premium footwear, and luxury accessories.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                SSL Encrypted
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <Truck className="w-4 h-4 text-emerald-400" />
                Global Shipping
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/shop/home" className="hover:text-amber-400 transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link to="/shop/listing" className="hover:text-amber-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop/search" className="hover:text-amber-400 transition-colors">
                  Search Store
                </Link>
              </li>
              <li>
                <Link to="/shop/account" className="hover:text-amber-400 transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Departments */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide">Categories</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/shop/listing?category=men" className="hover:text-amber-400 transition-colors">
                  Men&apos;s Fashion
                </Link>
              </li>
              <li>
                <Link to="/shop/listing?category=women" className="hover:text-amber-400 transition-colors">
                  Women&apos;s Apparel
                </Link>
              </li>
              <li>
                <Link to="/shop/listing?category=kids" className="hover:text-amber-400 transition-colors">
                  Kids Collection
                </Link>
              </li>
              <li>
                <Link to="/shop/listing?category=footwear" className="hover:text-amber-400 transition-colors">
                  Premium Footwear
                </Link>
              </li>
              <li>
                <Link to="/shop/listing?category=accessories" className="hover:text-amber-400 transition-colors">
                  Accessories &amp; Watches
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide">Newsletter</h4>
            <p className="text-xs text-slate-400">
              Subscribe to get special discount alerts and fashion updates directly in your inbox.
            </p>
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-slate-900 border-slate-800 text-white pl-9 text-xs focus:ring-amber-400 focus:border-amber-400 rounded-xl py-5"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-bold text-xs rounded-xl py-5 shadow-lg">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SmartWear Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 font-medium">
            Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for luxury online shopping.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default ShoppingFooter;
