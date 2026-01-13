import { Outlet } from "react-router-dom";
import { ShoppingBag, Sparkles, TrendingUp, Shield } from "lucide-react";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black w-1/2 px-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="max-w-md space-y-8 text-center text-white relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6 mx-auto">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              ECommerce
            </span>
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Your one-stop destination for premium shopping experience
          </p>
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <Sparkles className="w-6 h-6 mb-2 text-yellow-400" />
              <span className="text-sm font-medium">Premium Quality</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <TrendingUp className="w-6 h-6 mb-2 text-green-400" />
              <span className="text-sm font-medium">Best Prices</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <Shield className="w-6 h-6 mb-2 text-blue-400" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <ShoppingBag className="w-6 h-6 mb-2 text-purple-400" />
              <span className="text-sm font-medium">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
