import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function HeroSection() {
  const [searchData, setSearchData] = useState({
    specialty: "",
    location: "",
    medicalAid: ""
  });

  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.specialty) params.set("specialty", searchData.specialty);
    if (searchData.location) params.set("location", searchData.location);
    if (searchData.medicalAid) params.set("medicalAid", searchData.medicalAid);

    navigate(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Find the Right Specialist for Your Health Needs
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Search by specialty, location, or medical aid coverage. Your health,
          your choice, made simple.
        </p>

        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search for specialists..."
                value={searchData.specialty}
                onChange={(e) =>
                  handleInputChange("specialty", e.target.value)
                }
                onKeyPress={handleKeyPress}
              />
              <Input
                placeholder="Location"
                value={searchData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Input
                placeholder="Medical Aid"
                value={searchData.medicalAid}
                onChange={(e) =>
                  handleInputChange("medicalAid", e.target.value)
                }
                onKeyPress={handleKeyPress}
              />
              <Button
                onClick={handleSearch}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
