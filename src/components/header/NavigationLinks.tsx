
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavigationLinksProps {
  links: { name: string; path: string }[];
}

const NavigationLinks = ({ links }: NavigationLinksProps) => {
  const navigate = useNavigate();
  
  return (
    <nav className="hidden md:flex items-center space-x-6">
      {links.map((link, index) => (
        <Button 
          key={index}
          variant="ghost" 
          className="text-white hover:bg-pink-600 hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105"
          onClick={() => navigate(link.path)}
        >
          {link.name}
        </Button>
      ))}
    </nav>
  );
};

export default NavigationLinks;
