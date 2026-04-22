require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/Menu');
const User = require('./models/User');
const connectDB = require('./config/db');

async function seedData() {
  try {
    await connectDB();
    console.log("Connected. Starting Seed Process...");

    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log("DELETED all existing restaurants and menu items.");

    let ownerId;
    const users = await User.find({});
    if (users.length > 0) {
      ownerId = users[0]._id;
    } else {
      ownerId = new mongoose.Types.ObjectId();
      console.log("No users found. Using dummy owner ID:", ownerId);
    }

    const restaurantsData = [
      {
        name: "Italiano Gusto",
        description: "Authentic wood-fired pizzas and homemade pastas that bring Italy to your plate.",
        images: [{ public_id: "pizza_1", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["Italian", "Pizza"],
        address: { city: "Mumbai", street: "Colaba Causeway", state: "MH", pincode: "400001" },
        owner: ownerId, rating: 4.8, reviewsCount: 120, popularity: 95, isOpen: true, isApproved: true,
      },
      {
        name: "Spice Symphony",
        description: "Experience the rich and diverse flavors of authentic Indian spices and curries.",
        images: [{ public_id: "indian_1", url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["Indian", "Mughlai"],
        address: { city: "Delhi", street: "Connaught Place", state: "DL", pincode: "110001" },
        owner: ownerId, rating: 4.5, reviewsCount: 85, popularity: 88, isOpen: true, isApproved: true,
      },
      {
        name: "Neon Sushi",
        description: "Fresh cuts of premium sashimi and creative sushi rolls in a modern setting.",
        images: [{ public_id: "sushi_1", url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["Japanese", "Asian"],
        address: { city: "Bangalore", street: "Indiranagar", state: "KA", pincode: "560038" },
        owner: ownerId, rating: 4.9, reviewsCount: 200, popularity: 99, isOpen: true, isApproved: true,
      },
      {
        name: "Sweet Cravings",
        description: "Baked goods, gourmet desserts, and artisan coffees to satisfy your sweet tooth.",
        images: [{ public_id: "dessert_1", url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["Desserts", "Beverages"],
        address: { city: "Pune", street: "Koregaon Park", state: "MH", pincode: "411001" },
        owner: ownerId, rating: 4.3, reviewsCount: 45, popularity: 75, isOpen: true, isApproved: true,
      },
      {
        name: "Burger Joint",
        description: "Classic American burgers made with 100% grass-fed beef and fresh buns.",
        images: [{ public_id: "burger_1", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["American", "Fast Food"],
        address: { city: "Hyderabad", street: "Banjara Hills", state: "TS", pincode: "500034" },
        owner: ownerId, rating: 4.6, reviewsCount: 150, popularity: 90, isOpen: true, isApproved: true,
      },
      {
        name: "Taco Fiesta",
        description: "Authentic Mexican street tacos, burritos, and fresh guacamole.",
        images: [{ public_id: "taco_1", url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["Mexican", "Fast Food"],
        address: { city: "Chennai", street: "ECR", state: "TN", pincode: "600041" },
        owner: ownerId, rating: 4.4, reviewsCount: 95, popularity: 82, isOpen: true, isApproved: true,
      },
      {
        name: "Green Bowl",
        description: "Healthy salads, smoothie bowls, and vegan-friendly organic meals.",
        images: [{ public_id: "salad_1", url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["Healthy", "Vegan"],
        address: { city: "Mumbai", street: "Bandra West", state: "MH", pincode: "400050" },
        owner: ownerId, rating: 4.7, reviewsCount: 110, popularity: 85, isOpen: true, isApproved: true,
      },
      {
        name: "The French Bakery",
        description: "Artisanal breads, buttery croissants, and delicate French pastries.",
        images: [{ public_id: "bakery_1", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["Bakery", "Desserts"],
        address: { city: "Delhi", street: "Khan Market", state: "DL", pincode: "110003" },
        owner: ownerId, rating: 4.8, reviewsCount: 230, popularity: 94, isOpen: true, isApproved: true,
      },
      {
        name: "Dragon Wok",
        description: "Spicy Sichuan noodles, dim sum, and flavorful wok-tossed Chinese classics.",
        images: [{ public_id: "chinese_1", url: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["Chinese", "Asian"],
        address: { city: "Kolkata", street: "Park Street", state: "WB", pincode: "700016" },
        owner: ownerId, rating: 4.5, reviewsCount: 180, popularity: 89, isOpen: true, isApproved: true,
      },
      {
        name: "BBQ Nation",
        description: "Live grills, smoky BBQ meats, and an unlimited buffet experience.",
        images: [{ public_id: "bbq_1", url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["BBQ", "Indian"],
        address: { city: "Bangalore", street: "Koramangala", state: "KA", pincode: "560095" },
        owner: ownerId, rating: 4.6, reviewsCount: 340, popularity: 97, isOpen: true, isApproved: true,
      },
      {
        name: "Ocean Catch Seafood",
        description: "Freshly caught coastal seafood prepared with local spices.",
        images: [{ public_id: "seafood_1", url: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["Seafood", "Indian"],
        address: { city: "Goa", street: "Calangute", state: "GA", pincode: "403516" },
        owner: ownerId, rating: 4.7, reviewsCount: 155, popularity: 91, isOpen: true, isApproved: true,
      },
      {
        name: "Steakhouse Prime",
        description: "Premium aged steaks, fine wines, and classic European dining.",
        images: [{ public_id: "steak_1", url: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["European", "Mains"],
        address: { city: "Mumbai", street: "Lower Parel", state: "MH", pincode: "400013" },
        owner: ownerId, rating: 4.9, reviewsCount: 210, popularity: 98, isOpen: true, isApproved: true,
      },
      {
        name: "Punjab Grill",
        description: "Rich, buttery, and hearty North Indian delicacies like chole bhature and parathas.",
        images: [{ public_id: "punjabi_1", url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["Indian", "North Indian"],
        address: { city: "Chandigarh", street: "Sector 17", state: "CH", pincode: "160017" },
        owner: ownerId, rating: 4.6, reviewsCount: 300, popularity: 92, isOpen: true, isApproved: true,
      },
      {
        name: "Coffee & Co.",
        description: "Premium brewed coffee, espresso shots, and light café snacks.",
        images: [{ public_id: "coffee_1", url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["Beverages", "Cafe"],
        address: { city: "Pune", street: "FC Road", state: "MH", pincode: "411004" },
        owner: ownerId, rating: 4.5, reviewsCount: 90, popularity: 86, isOpen: true, isApproved: true,
      },
      {
        name: "Thai Lotus",
        description: "Aromatic Pad Thai, green curries, and authentic flavors from Thailand.",
        images: [{ public_id: "thai_1", url: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80" }],
        cuisineTypes: ["Thai", "Asian"],
        address: { city: "Chennai", street: "Nungambakkam", state: "TN", pincode: "600034" },
        owner: ownerId, rating: 4.4, reviewsCount: 130, popularity: 80, isOpen: true, isApproved: true,
      }
    ];

    const menuItemsPool = [
      // 1. Italiano Gusto
      [
        { name: "Margherita Pizza", description: "Classic tomato sauce, fresh mozzarella, and basil top a crispy crust.", price: 399, category: "Mains", cuisine: "Italian", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Penne Arrabbiata", description: "Spicy tomato sauce over perfectly cooked penne pasta.", price: 299, category: "Mains", cuisine: "Italian", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Tiramisu", description: "Classic Italian coffee-flavored dessert.", price: 199, category: "Dessert", cuisine: "Italian", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=500&q=80" }] }
      ],
      // 2. Spice Symphony
      [
        { name: "Butter Chicken", description: "Tender chicken cooked in a rich and creamy tomato gravy.", price: 450, category: "Mains", cuisine: "Indian", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Garlic Naan", description: "Soft Indian flatbread topped with garlic and butter.", price: 60, category: "Breads", cuisine: "Indian", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Paneer Tikka Masala", description: "Grilled cottage cheese cubes in a spicy onion-tomato gravy.", price: 350, category: "Mains", cuisine: "Indian", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=80" }] }
      ],
      // 3. Neon Sushi
      [
        { name: "Spicy Tuna Roll", description: "Fresh tuna with spicy mayo wrapped in nori and rice.", price: 550, category: "Sushi", cuisine: "Japanese", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Miso Soup", description: "Traditional Japanese soup with tofu and seaweed.", price: 150, category: "Starters", cuisine: "Japanese", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1549488344-c24775d7b5b6?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Salmon Sashimi", description: "Five thick slices of premium fresh salmon.", price: 700, category: "Sushi", cuisine: "Japanese", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1583623025817-d180a2221dce?auto=format&fit=crop&w=500&q=80" }] }
      ],
      // 4. Sweet Cravings
      [
        { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a gooey molten center.", price: 250, category: "Dessert", cuisine: "Desserts", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Blueberry Cheesecake", description: "Creamy cheesecake topped with fresh blueberry compote.", price: 300, category: "Dessert", cuisine: "Desserts", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Iced Caramel Macchiato", description: "Rich espresso combined with vanilla syrup and milk, drizzled with caramel.", price: 220, category: "Beverages", cuisine: "Beverages", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1558231367-a0680a6566d5?auto=format&fit=crop&w=500&q=80" }] }
      ],
      // 5. Burger Joint
      [
        { name: "Classic Cheeseburger", description: "Beef patty, cheddar cheese, lettuce, tomato on a sesame bun.", price: 350, category: "Fast Food", cuisine: "American", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Crispy Fries", description: "Golden French fries seasoned with salt and herbs.", price: 150, category: "Sides", cuisine: "American", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Veggie Burger", description: "Plant-based patty with fresh veggies and tahini sauce.", price: 280, category: "Fast Food", cuisine: "American", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=500&q=80" }] }
      ],
      // 6. Taco Fiesta
      [
        { name: "Chicken Tacos", description: "Three soft-shell tacos packed with grilled chicken and salsa.", price: 320, category: "Fast Food", cuisine: "Mexican", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Beef Burrito", description: "A massive wrap filled with rice, beans, beef, and cheese.", price: 400, category: "Mains", cuisine: "Mexican", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Nachos Supreme", description: "Crispy tortilla chips topped with melted cheese and jalapeños.", price: 250, category: "Starters", cuisine: "Mexican", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=500&q=80" }] }
      ],
      // 7. Green Bowl
      [
        { name: "Quinoa Salad", description: "A healthy mix of quinoa, cherry tomatoes, cucumbers, and lemon dressing.", price: 300, category: "Healthy", cuisine: "Healthy", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Avocado Toast", description: "Smashed avocado on rye bread topped with chili flakes.", price: 220, category: "Healthy", cuisine: "Healthy", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Acai Bowl", description: "Refreshing berry smoothie bowl topped with granola and coconut.", price: 350, category: "Dessert", cuisine: "Healthy", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=500&q=80" }] }
      ],
      // 8. The French Bakery
      [
        { name: "Butter Croissant", description: "Flaky, buttery, and freshly baked every morning.", price: 120, category: "Breads", cuisine: "Bakery", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Chocolate Éclair", description: "Choux pastry filled with cream and topped with rich chocolate.", price: 180, category: "Dessert", cuisine: "Bakery", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Macarons (Box of 4)", description: "Assorted French macarons in classic flavors.", price: 350, category: "Dessert", cuisine: "Bakery", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=500&q=80" }] }
      ],
      // 9. Dragon Wok
      [
        { name: "Hakka Noodles", description: "Wok-tossed noodles with colorful crunchy vegetables.", price: 200, category: "Mains", cuisine: "Chinese", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Chili Chicken", description: "Spicy, crispy chicken bites coated in a tangy soy glaze.", price: 350, category: "Starters", cuisine: "Chinese", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Dim Sum Basket", description: "Steamed chicken dumplings served with chili oil.", price: 280, category: "Starters", cuisine: "Chinese", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=80" }] }
      ],
      // 10. BBQ Nation
      [
        { name: "Tandoori Chicken", description: "Chicken marinated in yogurt and spices, roasted in a clay oven.", price: 400, category: "Starters", cuisine: "Indian", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1599487405270-b054238555e7?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Paneer Tikka Grill", description: "Skewered cottage cheese pieces cooked over live coals.", price: 320, category: "Starters", cuisine: "Indian", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Mutton Seekh Kebab", description: "Minced lamb kebabs packed with robust spices.", price: 450, category: "Starters", cuisine: "Indian", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80" }] }
      ],
      // 11. Ocean Catch Seafood
      [
        { name: "Prawn Curry", description: "Coastal-style prawn thick curry cooked with coconut milk.", price: 550, category: "Mains", cuisine: "Seafood", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1533726715494-06caffb9deac?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Fish Tikka", description: "Chunks of fresh fish marinated and grilled to perfection.", price: 450, category: "Starters", cuisine: "Seafood", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1599487405270-b054238555e7?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Calamari Rings", description: "Crispy fried squid rings served with tartar sauce.", price: 380, category: "Starters", cuisine: "Seafood", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80" }] }
      ],
      // 12. Steakhouse Prime
      [
        { name: "Ribeye Steak", description: "Juicy, well-marbled beef steak cooked to your liking.", price: 1200, category: "Mains", cuisine: "European", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Mashed Potatoes", description: "Creamy whipped potatoes with butter and garlic.", price: 200, category: "Sides", cuisine: "European", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Red Wine Jus", description: "Rich reduction sauce perfect for steaks.", price: 150, category: "Sides", cuisine: "European", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1549488344-c24775d7b5b6?auto=format&fit=crop&w=500&q=80" }] }
      ],
      // 13. Punjab Grill
      [
        { name: "Chole Bhature", description: "Spiced chickpeas served with fluffy deep-fried bread.", price: 180, category: "Mains", cuisine: "Indian", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Dal Makhani", description: "Slow-cooked black lentils in creamy butter sauce.", price: 280, category: "Mains", cuisine: "Indian", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Lassi", description: "Traditional sweet yogurt-based refreshing drink.", price: 90, category: "Beverages", cuisine: "Indian", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1558231367-a0680a6566d5?auto=format&fit=crop&w=500&q=80" }] }
      ],
      // 14. Coffee & Co.
      [
        { name: "Cappuccino", description: "Perfect balance of espresso, steamed milk, and froth.", price: 180, category: "Beverages", cuisine: "Cafe", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Iced Latte", description: "Chilled milk and strong espresso poured over ice.", price: 200, category: "Beverages", cuisine: "Cafe", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1558231367-a0680a6566d5?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Chocolate Muffin", description: "Soft muffin baked with dark chocolate chips.", price: 150, category: "Dessert", cuisine: "Cafe", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=500&q=80" }] }
      ],
      // 15. Thai Lotus
      [
        { name: "Pad Thai", description: "Classic Thai stir-fried rice noodles with peanuts & egg.", price: 350, category: "Mains", cuisine: "Thai", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Green Curry", description: "Aromatic coconut curry packed with veggies.", price: 400, category: "Mains", cuisine: "Thai", isVeg: true, images: [{ url: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=500&q=80" }] },
        { name: "Tom Yum Soup", description: "Hot and sour Thai soup with shrimp and herbs.", price: 250, category: "Starters", cuisine: "Thai", isVeg: false, images: [{ url: "https://images.unsplash.com/photo-1549488344-c24775d7b5b6?auto=format&fit=crop&w=500&q=80" }] }
      ]
    ];

    for (let i = 0; i < restaurantsData.length; i++) {
      const restData = restaurantsData[i];
      const newlyCreatedRestaurant = await Restaurant.create(restData);
      console.log(`Created Restaurant: ${newlyCreatedRestaurant.name}`);

      const itemsToCreate = menuItemsPool[i].map(item => ({
        ...item,
        restaurant: newlyCreatedRestaurant._id,
        createdBy: ownerId
      }));

      const createdItems = await MenuItem.insertMany(itemsToCreate);
      
      newlyCreatedRestaurant.menuItems = createdItems.map(item => item._id);
      await newlyCreatedRestaurant.save();
      
      console.log(` -> Added ${createdItems.length} menu items.`);
    }

    console.log("Seeding complete! 15 restaurants added.");
    process.exit(0);

  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seedData();
