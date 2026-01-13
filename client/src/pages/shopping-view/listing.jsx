import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions, filterOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  resetProductList,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon, Menu, Loader2, Filter, X, Sparkles, Grid3x3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }


  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails, pagination, isLoading, isLoadingMore } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

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
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters, setSearchParams]);

  // Load more products
  function handleLoadMore() {
    if (pagination.hasMore && !isLoadingMore) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: filters,
          sortParams: sort,
          page: pagination.currentPage + 1,
          append: true,
        })
      );
    }
  }

  useEffect(() => {
    // Reset product list when filters or sort change
    dispatch(resetProductList());
    
    if (filters !== null && sort !== null) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: filters,
          sortParams: sort,
          page: 1,
          append: false,
        })
      );
    }
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);


  // Count active filters
  const activeFiltersCount = Object.values(filters).reduce((acc, arr) => acc + (arr?.length || 0), 0);

  // Clear all filters
  function handleClearFilters() {
    setFilters({});
    sessionStorage.removeItem("filters");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h1 className="text-3xl md:text-4xl font-bold">Discover Products</h1>
              </div>
              <p className="text-gray-300 text-sm md:text-base">
                Find exactly what you&apos;re looking for
              </p>
            </div>
            {pagination.totalProducts > 0 && (
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <div className="text-2xl md:text-3xl font-bold">{pagination.totalProducts}</div>
                  <div className="text-xs text-gray-300">Total Products</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 md:gap-8">
          {/* Filter Sidebar - Hidden on mobile, shown in sheet */}
          <div className="hidden lg:block">
            <ProductFilter filters={filters} handleFilter={handleFilter} />
          </div>
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between bg-white hover:bg-gray-50 shadow-sm border-2"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="bg-primary text-white text-xs font-bold rounded-full px-2 py-0.5">
                        {activeFiltersCount}
                      </span>
                    )}
                  </div>
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <ProductFilter filters={filters} handleFilter={handleFilter} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Section */}
          <div className="bg-white w-full rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header with filters and sort */}
            <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-white via-gray-50 to-white">
              <div className="flex flex-col gap-4">
                {/* Top row: Title and Sort */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                      <Grid3x3 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        All Products
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {pagination.totalProducts > 0 
                          ? `Showing ${productList?.length || 0} of ${pagination.totalProducts} products`
                          : `${productList?.length || 0} ${productList?.length === 1 ? 'Product' : 'Products'}`
                        }
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 hover:bg-gray-50 border-2 shadow-sm"
                      >
                        <ArrowUpDownIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Sort by</span>
                        <span className="sm:hidden">Sort</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                        {sortOptions.map((sortItem) => (
                          <DropdownMenuRadioItem
                            value={sortItem.id}
                            key={sortItem.id}
                          >
                            {sortItem.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
                    <span className="text-xs font-semibold text-gray-600">Active Filters:</span>
                    {Object.entries(filters).map(([key, values]) =>
                      values?.map((value) => {
                        const option = filterOptions[key]?.find(opt => opt.id === value);
                        return option ? (
                          <div
                            key={`${key}-${value}`}
                            className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20"
                          >
                            <span>{option.label}</span>
                            <button
                              onClick={() => handleFilter(key, value)}
                              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : null;
                      })
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-xs h-7 px-2 text-gray-600 hover:text-gray-900"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {isLoading && productList.length === 0 ? (
              <div className="p-16 md:p-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 mb-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
                <p className="text-gray-600 text-lg font-medium">Loading products...</p>
                <p className="text-gray-400 text-sm mt-2">Please wait while we fetch the best products for you</p>
              </div>
            ) : productList && productList.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6">
                  {productList.map((productItem, index) => (
                    <div
                      key={productItem._id}
                      className="animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ShoppingProductTile
                        handleGetProductDetails={handleGetProductDetails}
                        product={productItem}
                        handleAddtoCart={handleAddtoCart}
                      />
                    </div>
                  ))}
                </div>
                {pagination.hasMore && (
                  <div className="p-6 md:p-8 text-center border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">
                        Showing {productList.length} of {pagination.totalProducts} products
                      </p>
                      <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary/60 h-full rounded-full transition-all duration-500"
                          style={{ width: `${(productList.length / pagination.totalProducts) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      size="lg"
                      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 text-white font-semibold px-8 py-6 text-base shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2 inline" />
                          Loading More...
                        </>
                      ) : (
                        <>
                          <span>Load More Products</span>
                          <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                            {pagination.totalProducts - productList.length} remaining
                          </span>
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="p-16 md:p-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                  <Filter className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  We couldn&apos;t find any products matching your filters. Try adjusting your search criteria.
                </p>
                {activeFiltersCount > 0 && (
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    className="border-2"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
