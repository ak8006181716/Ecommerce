import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Filter } from "lucide-react";

function ProductFilter({ filters, handleFilter }) {
  // Count active filters per section
  const getActiveCount = (keyItem) => {
    return filters && filters[keyItem] ? filters[keyItem].length : 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-20 overflow-hidden">
      <div className="p-5 md:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold">Filters</h2>
            <p className="text-xs text-gray-300 mt-0.5">Refine your search</p>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-5 space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
        {Object.keys(filterOptions).map((keyItem, index) => {
          const activeCount = getActiveCount(keyItem);
          return (
            <Fragment key={keyItem}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm md:text-base font-bold text-gray-900 capitalize">
                    {keyItem}
                  </h3>
                  {activeCount > 0 && (
                    <span className="bg-primary text-white text-xs font-bold rounded-full px-2 py-0.5">
                      {activeCount}
                    </span>
                  )}
                </div>
                <div className="grid gap-2.5">
                  {filterOptions[keyItem].map((option) => {
                    const isChecked = filters &&
                      Object.keys(filters).length > 0 &&
                      filters[keyItem] &&
                      filters[keyItem].indexOf(option.id) > -1;
                    
                    return (
                      <Label 
                        key={option.id}
                        className={`flex font-medium items-center gap-3 cursor-pointer transition-all duration-200 py-2 px-2 rounded-lg ${
                          isChecked 
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "hover:bg-gray-50 hover:text-gray-900 text-gray-700"
                        }`}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleFilter(keyItem, option.id)}
                          className={`border-2 ${
                            isChecked ? "border-primary bg-primary" : "border-gray-300"
                          }`}
                        />
                        <span className="text-sm flex-1">{option.label}</span>
                      </Label>
                    );
                  })}
                </div>
              </div>
              {index < Object.keys(filterOptions).length - 1 && (
                <Separator className="my-4 bg-gray-200" />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ProductFilter;
