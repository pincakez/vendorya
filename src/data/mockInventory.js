export const generateInventory = () => {
  const seasons = ['Summer', 'Winter', 'Spring', 'Autumn'];
  const genders = ['Male', 'Female', 'Both'];
  const types = ['T-Shirt', 'Jeans', 'Jacket', 'Sneakers', 'Hoodie', 'Dress'];
  const suppliers = ['VogueWear', 'ModaMix', 'TrendyCo', 'UrbanWear', 'StyleHub'];
  
  return Array.from({ length: 50 }).map((_, i) => {
    const wholesale = Math.floor(Math.random() * 500) + 100;
    const retail = Math.floor(wholesale * 2.5);
    return {
      id: (11300 + i).toString(),
      season: seasons[Math.floor(Math.random() * seasons.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      type: types[Math.floor(Math.random() * types.length)],
      model: `Model ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 99)}`,
      size: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
      wholesale: wholesale,
      retail: retail,
      profit: retail - wholesale,
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
    };
  });
};
