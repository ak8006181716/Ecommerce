import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto group hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white overflow-hidden">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative overflow-hidden bg-gray-100">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[280px] md:h-[300px] object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
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
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-red-600 font-bold text-sm shadow-md">
              {Math.round(((product?.price - product?.salePrice) / product?.price) * 100)}% OFF
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <h2 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground bg-gray-100 px-2 py-1 rounded">
              {categoryOptionsMap[product?.category] || product?.category}
            </span>
            <span className="text-sm text-muted-foreground bg-gray-100 px-2 py-1 rounded">
              {brandOptionsMap[product?.brand] || product?.brand}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-baseline gap-2">
              {product?.salePrice > 0 ? (
                <>
                  <span className="line-through text-sm text-gray-400">
                    ${product?.price}
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    ${product?.salePrice}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-primary">
                  ${product?.price}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-5 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed bg-gray-400">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddtoCart(product?._id, product?.totalStock);
            }}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-6 group-hover:shadow-lg transition-all duration-300"
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
