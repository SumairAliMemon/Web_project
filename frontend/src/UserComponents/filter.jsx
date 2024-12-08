import { MapPin, Star } from 'lucide-react';

const HostelCard = ({ hostel, onViewDetails }) => {
  const minPrice = Math.min(...hostel.rooms.map(r => r.pricePerMonth));
  const maxPrice = Math.max(...hostel.rooms.map(r => r.pricePerMonth));

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg transition-all">
      <img 
        src={hostel.image} 
        alt={hostel.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-white">{hostel.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <span className="text-white">{hostel.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-gray-400 mb-2">
          <MapPin className="h-4 w-4" />
          <span>{hostel.location}</span>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{hostel.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {hostel.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
              {amenity}
            </span>
          ))}
          {hostel.amenities.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
              +{hostel.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-white">
            <span className="text-sm text-gray-400">Starting from</span>
            <p className="font-semibold">${minPrice}/{maxPrice ? `-${maxPrice}` : ""} month</p>
          </div>
          <button
            onClick={() => onViewDetails(hostel)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;
