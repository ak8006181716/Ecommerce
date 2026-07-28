import { Button } from "@/components/ui/button";
import {
  Shirt,
  Sparkles,
  Baby,
  Watch,
  Footprints,
  Zap,
  Flame,
  Trophy,
  Scissors,
  Crown,
  Tag,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const defaultTextSlides = [
  {
    badge: "✨ Summer Collection 2026",
    title: "Elevate Your Style Every Day",
    highlight: "Exclusive Trends",
    description: "Discover curated designer wear, premium footwear, and accessories tailored for your unique aesthetic.",
  },
  {
    badge: "🔥 Flash Sale • Up to 50% Off",
    title: "Unmatched Performance & Comfort",
    highlight: "New Footwear Drop",
    description: "Step up your game with top-tier athletic sneakers, activewear, and street fashion essentials.",
  },
  {
    badge: "💎 Premium Accessories",
    title: "Luxury Essentials Redefined",
    highlight: "Timeless Quality",
    description: "Complete your look with hand-crafted watches, leather goods, and statement eyewear.",
  },
];

const NikeLogo = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M21.71 4.75c-3.18 3.55-7.85 7.9-12.7 10.9-2.3 1.4-4.5 2.1-6.1 2.1-1.3 0-2.1-.4-2.5-1.1-.3-.6-.2-1.4.3-2.1.8-1.2 2.4-2.2 4.4-3.1 3.5-1.5 8.1-2.4 13.5-2.4.6 0 1.2 0 1.8.1-1.2-.8-2.6-1.5-4.1-2-3.8-1.3-8.4-1-12.5.8-2.5 1.1-4.6 2.6-5.8 4.3-1 1.4-1.2 3.1-.6 4.7.7 2.1 2.8 3.4 5.6 3.4 2.2 0 4.9-.9 7.6-2.5 5.5-3.3 10.7-8.2 14.1-12.2.3-.4.3-.9 0-1.2-.3-.3-.8-.3-1.1.1z"/>
  </svg>
);

const AdidasLogo = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.2 18.5L14.7 9.5H10.4L15.9 18.5H20.2ZM14.9 18.5L10.7 11.6H6.4L10.6 18.5H14.9ZM9.6 18.5L6.7 13.8H2.4L5.3 18.5H9.6Z" />
  </svg>
);

const PumaLogo = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.5 4.5c-1.2.8-2.4 1.4-3.8 1.6 1-.8 1.6-1.9 1.8-3.1-1.3.8-2.7 1.4-4.3 1.7-1.2-1.3-3-2.1-4.9-2.1-3.7 0-6.7 3-6.7 6.7 0 .5.1 1 .2 1.5-5.6-.3-10.5-3-13.8-7-.6 1-.9 2.2-.9 3.4 0 2.3 1.2 4.4 3 5.6-1.1 0-2.2-.3-3.1-.9v.1c0 3.3 2.3 6 5.4 6.7-.6.2-1.2.3-1.8.3-.4 0-.9 0-1.3-.1.9 2.7 3.4 4.7 6.4 4.7-2.4 1.9-5.4 3-8.7 3-.6 0-1.1 0-1.7-.1 3.1 2 6.8 3.1 10.7 3.1 12.8 0 19.8-10.6 19.8-19.8 0-.3 0-.6 0-.9 1.4-1 2.5-2.2 3.4-3.6z"/>
  </svg>
);

const LevisLogo = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c-3 1.5-6 1.5-8 0-2 1.5-5 1.5-8 0-2 1.5-4 1.5-4 0z" fill="#cc0000" />
    <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#ffffff" letterSpacing="0.5">
      LEVI&apos;S
    </text>
  </svg>
);

const ZaraLogo = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight="900" fontFamily="serif" letterSpacing="1">
      ZARA
    </text>
  </svg>
);

const HMLogo = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <text x="50%" y="66%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight="900" fontStyle="italic" letterSpacing="0.2">
      H&amp;M
    </text>
  </svg>
);

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: Shirt },
  { id: "women", label: "Women", icon: Sparkles },
  { id: "kids", label: "Kids", icon: Baby },
  { id: "accessories", label: "Accessories", icon: Watch },
  { id: "footwear", label: "Footwear", icon: Footprints },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: NikeLogo },
  { id: "adidas", label: "Adidas", icon: AdidasLogo },
  { id: "puma", label: "Puma", icon: PumaLogo },
  { id: "levi", label: "Levi's", icon: LevisLogo },
  { id: "zara", label: "Zara", icon: ZaraLogo },
  { id: "h&m", label: "H&M", icon: HMLogo },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const hasFeatureImages = featureImageList && featureImageList.length > 0;

  const slidesToRender = hasFeatureImages
    ? featureImageList.map((item, index) => ({
        image: item.image,
        badge: defaultTextSlides[index % defaultTextSlides.length].badge,
        title: defaultTextSlides[index % defaultTextSlides.length].title,
        highlight: defaultTextSlides[index % defaultTextSlides.length].highlight,
        description: defaultTextSlides[index % defaultTextSlides.length].description,
      }))
    : defaultTextSlides;

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slidesToRender.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slidesToRender]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
        page: 1,
        append: false,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[520px] sm:h-[620px] md:h-[700px] lg:h-[760px] overflow-hidden bg-slate-950">
        {hasFeatureImages ? (
          slidesToRender.map((slide, index) => (
            <div
              key={slide.image || index}
              className={`${
                index === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
              } absolute inset-0 transition-all duration-1000 ease-in-out`}
            >
              <img
                src={slide.image}
                alt={`Hero Banner ${index + 1}`}
                className="w-full h-full object-cover object-center filter brightness-[0.85]"
              />
              {/* Multi-stage Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent md:w-3/4"></div>
            </div>
          ))
        ) : (
          /* Premium Dark Mesh Canvas Background when no images are uploaded */
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
          </div>
        )}

        {/* Hero Content Box */}
        <div className="absolute inset-0 z-20 flex items-center px-6 sm:px-12 lg:px-20">
          <div key={currentSlide} className="max-w-2xl text-left space-y-4 sm:space-y-5">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight animate-hero-text">
              {slidesToRender[currentSlide]?.title.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 animate-text-shimmer">
                {slidesToRender[currentSlide]?.highlight || "New Styles"}
              </span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-slate-200 font-light max-w-xl leading-relaxed animate-hero-subtext">
              {slidesToRender[currentSlide]?.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 animate-hero-buttons">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-bold text-base sm:text-lg px-8 py-6 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all duration-300 group"
                onClick={() => navigate("/shop/listing")}
              >
                Shop Collection
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-slate-950 text-base sm:text-lg px-8 py-6 rounded-xl transition-all duration-300"
                onClick={() => navigate("/shop/listing")}
              >
                Explore Deals
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Navigation Controls */}
        {slidesToRender.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentSlide(
                  (prevSlide) =>
                    (prevSlide - 1 + slidesToRender.length) % slidesToRender.length
                )
              }
              className="absolute top-1/2 left-4 sm:left-8 z-30 transform -translate-y-1/2 w-12 h-12 rounded-full bg-slate-950/40 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 group"
              aria-label="Previous Slide"
            >
              <ChevronLeftIcon className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() =>
                setCurrentSlide(
                  (prevSlide) => (prevSlide + 1) % slidesToRender.length
                )
              }
              className="absolute top-1/2 right-4 sm:right-8 z-30 transform -translate-y-1/2 w-12 h-12 rounded-full bg-slate-950/40 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 group"
              aria-label="Next Slide"
            >
              <ChevronRightIcon className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}

        {/* Slide Indicators & Progress Bar */}
        {slidesToRender.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-3 bg-slate-950/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            {slidesToRender.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? "w-10 bg-gradient-to-r from-amber-400 to-orange-500"
                    : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Trust & Perks Bar */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white border-y border-slate-800 py-4 sm:py-6 shadow-inner w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-md">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base">Free Express Shipping</h4>
                <p className="text-xs sm:text-sm text-slate-400">On all orders over $50</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-md">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base">100% Secure Checkout</h4>
                <p className="text-xs sm:text-sm text-slate-400">Encrypted payment gateway</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-md">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base">Easy 30-Day Returns</h4>
                <p className="text-xs sm:text-sm text-slate-400">Hassle-free refund policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="p-3 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base">24/7 Priority Support</h4>
                <p className="text-xs sm:text-sm text-slate-400">Dedicated assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-background via-slate-50/50 dark:via-slate-900/50 to-background relative overflow-hidden w-full">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="text-center mb-6 sm:mb-8 space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto font-light">
              Browse through our hand-crafted departments to discover styles tailored for you.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {categoriesWithIcon.map((categoryItem) => (
              <div
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer group relative bg-white dark:bg-slate-900 hover:bg-slate-950 dark:hover:bg-amber-400 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-[0_25px_60px_-15px_rgba(251,191,36,0.3)] dark:shadow-slate-950/50 dark:hover:shadow-[0_25px_60px_-15px_rgba(251,191,36,0.4)] border border-slate-200/80 dark:border-slate-800 hover:border-slate-900 dark:hover:border-amber-400 transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden hover:-translate-y-2.5"
              >
                <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-400/20 group-hover:bg-amber-400 dark:group-hover:bg-slate-950 transition-all duration-500 mb-5 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:text-slate-950 dark:group-hover:text-amber-400 shadow-inner group-hover:shadow-xl group-hover:scale-110 w-16 h-16 sm:w-20 sm:h-20">
                  <categoryItem.icon className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-white dark:group-hover:text-slate-950 text-lg transition-colors">
                  {categoryItem.label}
                </h3>
                <span className="text-xs text-slate-400 dark:text-slate-400 group-hover:text-amber-400 dark:group-hover:text-slate-900 mt-1 font-semibold flex items-center gap-1">
                  Explore Products
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Callout Banner */}
      <section className="py-6 sm:py-8 px-4 sm:px-8 lg:px-12 xl:px-16 bg-background w-full">
        <div className="w-full">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 md:p-16 shadow-2xl border border-white/10">
            <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 max-w-xl space-y-4">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
                Up to 50% Off <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                  On Premium Apparel
                </span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base font-light">
                Upgrade your wardrobe with top fashion labels. Free shipping included on all orders today.
              </p>
              <div className="pt-2">
                <Button
                  size="lg"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-8 py-6 rounded-xl shadow-lg hover:scale-105 transition-all"
                  onClick={() => navigate("/shop/listing")}
                >
                  Claim Offer Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-background via-slate-50/50 dark:via-slate-900/50 to-background w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="text-center mb-6 sm:mb-8 space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Featured Brands
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto font-light">
              Shop iconic products crafted by the world&apos;s leading fashion houses.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {brandsWithIcon.map((brandItem) => (
              <div
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer group bg-white dark:bg-slate-900 hover:bg-slate-950 dark:hover:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 hover:border-slate-900 dark:hover:border-slate-700 shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-slate-950/50 dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-500 flex flex-col items-center justify-center text-center hover:-translate-y-2"
              >
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm group-hover:shadow-lg transition-all duration-500 mb-3 group-hover:scale-110 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
                  <brandItem.icon className="w-10 h-10 transition-transform duration-300" />
                </div>
                <span className="font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-white dark:group-hover:text-amber-400 text-base tracking-wide transition-colors">
                  {brandItem.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-background via-slate-50/50 dark:via-slate-900/50 to-background w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="text-center mb-6 sm:mb-8 space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Featured Products
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto font-light">
              Explore our highest-rated customer favorites available right now.
            </p>
          </div>

          {productList && productList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {productList.slice(0, 8).map((productItem) => (
                <div
                  key={productItem._id}
                  className="transition-all duration-300 hover:-translate-y-1"
                >
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No products available at the moment</p>
            </div>
          )}

          {productList && productList.length > 8 && (
            <div className="text-center mt-12 sm:mt-16">
              <Button
                size="lg"
                className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-10 py-6 text-lg rounded-xl shadow-xl hover:scale-105 transition-all"
                onClick={() => navigate("/shop/listing")}
              >
                View All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
