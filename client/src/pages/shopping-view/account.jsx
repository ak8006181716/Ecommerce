import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="relative h-[200px] sm:h-[250px] md:h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">My Account</h1>
        </div>
      </div>
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-12">
        <div className="flex flex-col rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 md:p-6 lg:p-8 shadow-sm">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="orders" className="text-sm md:text-base">Orders</TabsTrigger>
              <TabsTrigger value="address" className="text-sm md:text-base">Address</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-0">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address" className="mt-0">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
