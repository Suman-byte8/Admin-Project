import React from "react";

const OfferCard = ({
  offer,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6 flex flex-col justify-between">
      {/* Image */}
      <div className="mb-4">
        <img
          src={offer.image}
          alt={offer.title}
          className="w-full h-48 object-cover rounded-lg"
          loading="lazy"
          width="400"
          height="192"
        />
      </div>

      {/* Offer Details */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-800">
          {offer.title}
        </h2>
        
        {offer.description && (
          <p className="text-gray-600 text-sm">
            {offer.description}
          </p>
        )}



        {/* Details List */}
        {offer.details && offer.details.length > 0 && (
          <div className="mt-3">
            {/* <h4 className="text-sm font-medium text-gray-700 mb-2">Details:</h4> */}
            <ul className="space-y-1 text-sm text-gray-600">
              {offer.details.map((detail, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        )}


      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-2 pt-4">
        <button
          onClick={() => onEdit(offer)}
          className="bg-[#2c5e6e] text-white px-4 py-2 rounded-lg hover:bg-[#244c58] transition text-sm font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(offer._id)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default OfferCard;
