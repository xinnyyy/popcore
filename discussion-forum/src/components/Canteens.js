import { useEffect, useState } from "react";
import CanteenDetails from "../components/CanteenDetails";
import { useAuthContext } from "../hooks/useAuthContext";
import SearchBar from "../components/SearchBar";

const BASE_API_URL = process.env.REACT_APP_API_URL;

const Canteens = () => {
  const [canteens, setCanteens] = useState([]);
  const [filteredCanteens, setFilteredCanteens] = useState([]);
  const { user } = useAuthContext();

  const handleSearch = (input) => {
    const filtered = canteens.filter((canteen) => 
      canteen.name.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredCanteens(filtered);
  }

  useEffect(() => {
    const fetchCanteens = async () => {
      const response = await fetch(`${BASE_API_URL}/api/canteen/`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json(); //array of canteen objects
      console.log(json);
      if (response.ok) {
        setCanteens(json);
        setFilteredCanteens(json); // initially show all canteens
      }
    };
    if (user) {
      fetchCanteens();
    }
  }, [user]);

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div className="flex flex-row justify-start  mt-4">
        <div className="canteens">
          {filteredCanteens && filteredCanteens.length > 0 ? (
            filteredCanteens.map((canteen) => (
              <CanteenDetails key={canteen.id} canteen={canteen} />
            ))
          ) : (
            <p className="error">No canteens found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canteens;
