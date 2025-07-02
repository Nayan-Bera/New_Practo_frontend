import React from "react";
import PortalWrapper from "../portal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Loader2 } from "lucide-react";

const Loader: React.FC = () => {
  const loader = useSelector((state: RootState) => state.loader);

  if (loader <= 0) return null;

  return (
    <PortalWrapper>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Loader2 className="h-[60px] w-[60px] text-primary animate-spin" />
      </div>
    </PortalWrapper>
  );
};

export default Loader; 