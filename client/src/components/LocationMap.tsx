import { Location } from "@shared/schema";
import { useState } from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LocationMapProps {
  locations: Location[];
}

const LocationMap = ({ locations }: LocationMapProps) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<string>("all");

  // This would normally use a real map
  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-lg font-medium">Our Locations</h2>
        </div>
        
        <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
          {/* Map placeholder - would be replaced with actual map */}
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-gray-400" />
            <span className="sr-only">Map of coffee shop locations</span>
          </div>
          
          {/* Location pins */}
          {locations.map((location, index) => {
            // Simplified positioning for mocked map
            const positions = [
              { top: "1/4", left: "1/4" }, 
              { top: "1/2", left: "1/2" },
              { top: "2/3", right: "1/4" }
            ];
            const pos = positions[index % positions.length];
            
            return (
              <button 
                key={location.id}
                className={cn(
                  "absolute w-8 h-8 rounded-full text-white flex items-center justify-center -mt-4 -ml-4",
                  selectedLocation?.id === location.id ? "bg-accent" : "bg-primary"
                )}
                style={{ 
                  top: `${pos.top}`, 
                  left: pos.left ? `${pos.left}` : "auto", 
                  right: pos.right ? `${pos.right}` : "auto" 
                }}
                onClick={() => handleLocationClick(location)}
                aria-label={`Select ${location.name} location`}
              >
                <MapPin className="h-4 w-4" />
              </button>
            );
          })}
        </div>
        
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2">
            <Button
              variant={distanceFilter === "all" ? "default" : "outline"}
              className="flex-shrink-0"
              onClick={() => setDistanceFilter("all")}
            >
              All Locations
            </Button>
            <Button
              variant={distanceFilter === "5miles" ? "default" : "outline"}
              className="flex-shrink-0"
              onClick={() => setDistanceFilter("5miles")}
            >
              Within 5 miles
            </Button>
            <Button
              variant={distanceFilter === "10miles" ? "default" : "outline"}
              className="flex-shrink-0"
              onClick={() => setDistanceFilter("10miles")}
            >
              Within 10 miles
            </Button>
          </div>
        </ScrollArea>
        
        {selectedLocation && (
          <div className="mt-4 p-4 bg-secondary bg-opacity-20 rounded-lg">
            <h3 className="font-medium text-lg mb-2">{selectedLocation.name}</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span className="text-sm">
                  {selectedLocation.address}, {selectedLocation.city}, {selectedLocation.state} {selectedLocation.zip}
                </span>
              </div>
              {selectedLocation.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">{selectedLocation.phone}</span>
                </div>
              )}
              {selectedLocation.hours && (
                <div className="flex items-start">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span className="text-sm">{selectedLocation.hours}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationMap;
