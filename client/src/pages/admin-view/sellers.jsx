import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { useDispatch, useSelector } from "react-redux";
import {
  createSeller,
  getAllSellers,
  getSellerOrders,
  resetSellerOrders,
} from "@/store/admin/seller-slice";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { sellerFormControls } from "@/config";

const initialFormData = {
  userName: "",
  email: "",
  password: "",
  businessType: "",
  mobileNumber: "",
};

function AdminSellers() {
  const [openCreateSellerDialog, setOpenCreateSellerDialog] = useState(false);
  const [openOrdersDialog, setOpenOrdersDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const { sellerList, sellerOrders } = useSelector((state) => state.adminSeller);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  useEffect(() => {
    if (sellerOrders !== null) {
      setOpenOrdersDialog(true);
    }
  }, [sellerOrders]);

  function onSubmit(event) {
    event.preventDefault();
    dispatch(createSeller(formData)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getAllSellers());
        setFormData(initialFormData);
        setOpenCreateSellerDialog(false);
        toast({
          title: "Seller created successfully",
        });
      } else {
        toast({
          title: data?.payload?.message || "Failed to create seller",
          variant: "destructive",
        });
      }
    });
  }

  function handleViewOrders(sellerId) {
    dispatch(getSellerOrders(sellerId));
  }

  function isFormValid() {
    return (
      formData.userName !== "" &&
      formData.email !== "" &&
      formData.password !== "" &&
      formData.businessType !== "" &&
      formData.mobileNumber !== ""
    );
  }

  return (
    <div>
      <div className="mb-5 w-full flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Seller Information</h1>
          <p className="text-muted-foreground mt-1">
            Total Sellers: {sellerList?.length || 0}
          </p>
        </div>
        <Button onClick={() => setOpenCreateSellerDialog(true)}>
          Add Seller
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sellers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellerList && sellerList.length > 0
                ? sellerList.map((seller) => (
                    <TableRow key={seller._id}>
                      <TableCell className="font-medium">
                        {seller.userName}
                      </TableCell>
                      <TableCell>{seller.email}</TableCell>
                      <TableCell>
                        {seller.businessType ? (
                          <Badge variant="outline">{seller.businessType}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{seller.mobileNumber || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          onClick={() => handleViewOrders(seller._id)}
                        >
                          View Orders
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No sellers found. Click "Add Seller" to create your first seller.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet
        open={openCreateSellerDialog}
        onOpenChange={() => {
          setOpenCreateSellerDialog(false);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add New Seller</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText="Add Seller"
              formControls={sellerFormControls}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Dialog
        open={openOrdersDialog}
        onOpenChange={() => {
          setOpenOrdersDialog(false);
          dispatch(resetSellerOrders());
        }}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-auto">
          <div className="grid gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Seller Orders</h2>
              {sellerOrders && (
                <div className="grid gap-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Orders:</span>
                    <Badge variant="outline" className="text-lg">
                      {sellerOrders.totalOrders || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Revenue:</span>
                    <Badge variant="outline" className="text-lg">
                      ${sellerOrders.totalRevenue?.toFixed(2) || 0}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
            {sellerOrders && sellerOrders.orders && sellerOrders.orders.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold mb-4">Order List</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sellerOrders.orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-mono text-xs">
                          {order._id}
                        </TableCell>
                        <TableCell>
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`py-1 px-3 ${
                              order.orderStatus === "confirmed"
                                ? "bg-green-500"
                                : order.orderStatus === "rejected"
                                ? "bg-red-600"
                                : "bg-black"
                            }`}
                          >
                            {order.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>${order.totalAmount || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No orders found for this seller
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminSellers;
