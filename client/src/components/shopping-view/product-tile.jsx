import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import LazyImage from "../common/lazy-image";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto group hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
          <LazyImage
            src={product?.image}
            alt={product?.title}
            className="w-full h-[280px] md:h-[300px] object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 shadow-lg">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-3 py-1 shadow-lg">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 shadow-lg animate-pulse">
              Sale
            </Badge>
          ) : null}
          {product?.salePrice > 0 && product?.totalStock > 0 && (
            <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-3 py-1 text-red-600 dark:text-red-400 font-bold text-sm shadow-md">
              {Math.round(((product?.price - product?.salePrice) / product?.price) * 100)}% OFF
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <h2 className="text-lg font-bold mb-2 line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors">
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md font-medium">
              {categoryOptionsMap[product?.category] || product?.category}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md font-medium">
              {brandOptionsMap[product?.brand] || product?.brand}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-baseline gap-2">
              {product?.salePrice > 0 ? (
                <>
                  <span className="line-through text-sm text-slate-400">
                    ₹{product?.price}
                  </span>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                    ₹{product?.salePrice}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  ₹{product?.price}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-5 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed bg-slate-400 dark:bg-slate-800 text-white">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddtoCart(product?._id, product?.totalStock);
            }}
            className="w-full bg-slate-950 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-500 text-white dark:text-slate-950 font-bold py-6 group-hover:shadow-lg transition-all duration-300"
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
