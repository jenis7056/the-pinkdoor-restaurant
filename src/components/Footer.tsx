
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-pink-950 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-playfair font-semibold mb-4">The PinkDoor Restaurant</h3>
            <p className="text-gray-300 text-sm">
              Experience the best of vegetarian cuisine in an elegant atmosphere.
              Our restaurant offers a wide variety of dishes prepared with fresh ingredients.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-playfair font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  className="text-gray-300 hover:text-white text-sm" 
                  onClick={() => navigate("/")}
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  className="text-gray-300 hover:text-white text-sm" 
                  onClick={() => navigate("/customer-registration")}
                >
                  Make a Reservation
                </button>
              </li>
              <li>
                <button 
                  className="text-gray-300 hover:text-white text-sm" 
                  onClick={() => navigate("/login")}
                >
                  Staff Portal
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-playfair font-semibold mb-4">Contact Us</h3>
            <address className="text-gray-300 text-sm not-italic">
              <p>Shop 4 & 5, Pramukh Anand Orbit Mall</p>
              <p>Kudasan Road, Reliance Cross Rd</p>
              <p>Gandhinagar, Gujarat 382421</p>
              <p className="mt-2">Phone: (555) 123-4567</p>
              <p>Email: info@pinkdoorrestaurant.com</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-pink-900 mt-8 pt-4 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} The PinkDoor Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
