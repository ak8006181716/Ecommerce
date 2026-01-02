import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProducts } from "@/store/seller/products-slice";
import { getSellerOrders } from "@/store/seller/order-slice";

function SellerDashboard() {
  const { productList } = useSelector((state) => state.sellerProducts);
  const { orderList } = useSelector((state) => state.sellerOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSellerProducts());
    dispatch(getSellerOrders());
  }, [dispatch]);

  const totalProducts = productList?.length || 0;
  const totalOrders = orderList?.length || 0;
  const totalRevenue = orderList?.reduce((sum, order) => {
    return sum + (order.sellerOrderTotal || 0);
  }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalProducts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalOrders}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SellerDashboard;

