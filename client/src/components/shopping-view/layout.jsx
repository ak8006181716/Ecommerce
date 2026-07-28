import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import ShoppingFooter from "./footer";

function ShoppingLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white overflow-x-hidden">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full flex-grow">
        <Outlet />
      </main>
      {/* common footer */}
      <ShoppingFooter />
    </div>
  );
}

export default ShoppingLayout;
