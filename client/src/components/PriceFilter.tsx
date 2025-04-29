import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatCurrency, priceRanges } from "@/lib/utils";

interface PriceFilterProps {
  onFilterChange: (min: number, max: number) => void;
}

const PriceFilter = ({ onFilterChange }: PriceFilterProps) => {
  const [priceValue, setPriceValue] = useState([0, 10]);
  const [activeRange, setActiveRange] = useState<number | null>(null);

  const handleSliderChange = (value: number[]) => {
    setPriceValue(value);
    onFilterChange(value[0], value[1]);
    setActiveRange(null);
  };

  const handleRangeClick = (index: number, min: number, max: number) => {
    setPriceValue([min, max]);
    onFilterChange(min, max);
    setActiveRange(index);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-4">
        <h2 className="font-serif text-lg font-medium mb-3">Price Filter</h2>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Price Range</span>
            <span className="text-sm font-medium text-primary">
              {formatCurrency(priceValue[0])} - {priceValue[1] === 10 ? "Any" : formatCurrency(priceValue[1])}
            </span>
          </div>
          <Slider
            value={priceValue}
            min={0}
            max={10}
            step={0.5}
            onValueChange={handleSliderChange}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>$5</span>
            <span>$10+</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range, index) => (
            <Button
              key={index}
              variant={activeRange === index ? "default" : "outline"}
              size="sm"
              className="text-sm"
              onClick={() => handleRangeClick(index, range.min, range.max)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceFilter;
