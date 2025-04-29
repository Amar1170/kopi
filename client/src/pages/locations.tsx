import { useQuery } from "@tanstack/react-query";
import { Location } from "@shared/schema";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Locations = () => {
  const { data: locations, isLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-medium mb-2">Our Locations</h1>
        <p className="text-muted-foreground">
          Find a Coffee Haven near you and drop by for a visit. We'd love to serve you!
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-24 mb-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-40 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : locations && locations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((location) => (
            <Card key={location.id}>
              <CardHeader className="pb-2">
                <CardTitle>{location.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {location.image_url && (
                  <div className="w-full h-40 rounded-md overflow-hidden mb-4">
                    <img 
                      src={location.image_url} 
                      alt={location.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                    <div>
                      <p>{location.address}</p>
                      <p>{location.city}, {location.state} {location.zip}</p>
                    </div>
                  </div>
                  
                  {location.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-primary" />
                      <p>{location.phone}</p>
                    </div>
                  )}
                  
                  {location.hours && (
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                      <p>{location.hours}</p>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <Button className="w-full" size="sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-xl font-medium mb-1">No locations found</p>
          <p className="text-muted-foreground">Please check back later for our store locations.</p>
        </div>
      )}
      
      <div className="mt-8 bg-secondary bg-opacity-30 p-6 rounded-lg">
        <h2 className="text-xl font-serif font-medium mb-3">Interested in a franchise?</h2>
        <p className="mb-4">Love our coffee? Become a part of the Coffee Haven family by opening your own franchise.</p>
        <Button variant="outline">
          Learn More <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Locations;
