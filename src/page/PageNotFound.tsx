import React from "react";
import { Button } from "@/components/ui/button";
import PageNotFoundImg from "@/assets/images/404.png";
import history from "@/utils/createHistory";

const PageNotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-6">
          404
        </h1>
        <img 
          src={PageNotFoundImg} 
          alt="Page Not Found" 
          className="w-[400px] max-w-full mx-auto mb-6"
        />
        <h2 className="text-2xl font-bold mb-6">
          Page Not Found!
        </h2>
        <Button 
          variant="default"
          size="lg"
          className="font-bold"
          onClick={() => history.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default PageNotFound; 