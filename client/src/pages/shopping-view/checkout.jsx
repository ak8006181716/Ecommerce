import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder, capturePayment } from "@/store/shop/order-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  async function handleInitiateRazorpayPayment() {
    if (!cartItems?.items?.length) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast({
        title: "Razorpay SDK failed to load. Please check your internet connection.",
        variant: "destructive",
      });
      return;
    }

    setIsPaymentStart(true);

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        const { razorpayOrderId, amount, currency, orderId } = data.payload;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TIyzNkkcytEawu",
          amount: amount,
          currency: currency || "INR",
          name: "SmartWear Store",
          description: "Order Payment",
          order_id: razorpayOrderId,
          handler: function (response) {
            dispatch(
              capturePayment({
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                orderId: orderId,
              })
            ).then((captureData) => {
              setIsPaymentStart(false);
              if (captureData?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast({
                  title: "Payment successful! Your order has been placed.",
                });
                navigate("/shop/account");
              } else {
                toast({
                  title: "Failed to confirm payment.",
                  variant: "destructive",
                });
              }
            });
          },
          modal: {
            ondismiss: function () {
              setIsPaymentStart(false);
              toast({
                title: "Payment cancelled",
                variant: "destructive",
              });
            },
          },
          prefill: {
            name: user?.userName || "",
            email: user?.email || "",
            contact: currentSelectedAddress?.phone || "",
          },
          theme: {
            color: "#0f172a",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        setIsPaymentStart(false);
        toast({
          title: "Failed to initialize payment.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="relative h-[200px] sm:h-[250px] md:h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Checkout</h1>
        </div>
      </div>
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="order-2 lg:order-1">
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>
          <div className="order-1 lg:order-2">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-4 md:p-6 sticky top-20 text-slate-900 dark:text-slate-100">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                Order Summary
              </h2>
              <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto mb-6">
                {cartItems && cartItems.items && cartItems.items.length > 0
                  ? cartItems.items.map((item) => (
                      <UserCartItemsContent key={item._id || item.productId} cartItem={item} />
                    ))
                  : (
                    <p className="text-slate-500 text-center py-8">Your cart is empty</p>
                  )}
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Total</span>
                  <span className="font-bold text-xl text-slate-900 dark:text-slate-100">₹{totalCartAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6">
                <Button 
                  onClick={handleInitiateRazorpayPayment} 
                  className="w-full bg-slate-950 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-500 text-white dark:text-slate-950 font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isPaymentStart}
                >
                  {isPaymentStart
                    ? "Processing Razorpay Payment..."
                    : "Pay Now with Razorpay"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
