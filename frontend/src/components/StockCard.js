import React from "react";

const StockCard = ({ stock }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <img src={stock.image_url} alt={stock.name} className="w-full h-32 object-cover rounded-md" />
      <h3 className="text-xl font-bold mt-2">{stock.name}</h3>
      <p>Price: {stock.price} Coins</p>
      <p>Available: {stock.available}</p>
    </div>
  );
};

export default StockCard;
