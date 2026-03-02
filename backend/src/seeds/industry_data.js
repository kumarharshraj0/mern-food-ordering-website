const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/Menu");
const User = require("../models/User");
require("dotenv").config();

const industryData = [{
    name: "The Gourmet Kitchen",
    description: "Fine dining experience with a focus on organic, locally sourced ingredients. Our chefs prepare each dish with precision and passion.",
    cuisineTypes: ["Italian", "French", "Continental"],
    address: {

        street: "123 Elegance Way",
        city: "Lucknow",
        state: "Uttar Pradesh",
        pincode: "226001"
    },
    images: [{ url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80" }],
    rating: 4.8,
    reviewsCount: 156,
    popularity: 92,
    isOpen: true,
    menuItems: [
        {
            name: "Truffle Risotto",
            description: "Creamy Arborio rice with black truffle oil, wild mushrooms, and aged Parmesan cheese.",
            price: 850,
            category: "Main Course",
            cuisine: "Italian",
            isVeg: true,
            images: [{ url: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=500&q=80" }]
        },
        {
            name: "Grilled Salmon",
            description: "Fresh Atlantic salmon with lemon-butter sauce, asparagus, and roasted baby potatoes.",
            price: 950,
            category: "Main Course",
            cuisine: "Continental",
            isVeg: false,
            images: [{ url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=500&q=80" }]
        },
        {
            name: "Ratatouille",
            description: "Classic French Provencal stewed vegetable dish, layered with zucchini, eggplant, and bell peppers.",
            price: 650,
            category: "Main Course",
            cuisine: "French",
            isVeg: true,
            images: [{ url: "https://images.unsplash.com/photo-1572453800999-e8d2d4d0c7ee?auto=format&fit=crop&w=500&q=80" }]
        }
    ]
},
{
    name: "Spice Route",
    description: "Authentic Indian flavors with a modern twist. Experience the rich heritage of spices in every bite.",
    cuisineTypes: ["Indian", "Tandoori"],
    address: {
        street: "45 Heritage Road",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001"
    },
    images: [{ url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" }],
    rating: 4.5,
    reviewsCount: 210,
    popularity: 88,
    isOpen: true,
    menuItems: [
        {
            name: "Butter Chicken",
            description: "Tender chicken pieces cooked in a rich, creamy tomato gravy with a touch of butter.",
            price: 450,
            category: "Main Course",
            cuisine: "Indian",
            isVeg: false,
            images: [{ url: "https://images.unsplash.com/photo-1603894584202-9ca8fe99539a?auto=format&fit=crop&w=500&q=80" }]
        },
        {
            name: "Paneer Tikka",
            description: "Marinated cottage cheese cubes grilled to perfection in a traditional clay oven.",
            price: 350,
            category: "Appetizer",
            cuisine: "Indian",
            isVeg: true,
            images: [{ url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=80" }]
        },
        {
            name: "Dal Makhani",
            description: "Slow-cooked black lentils with cream and spices for a rich, authentic taste.",
            price: 320,
            category: "Main Course",
            cuisine: "Indian",
            isVeg: true,
            images: [{ url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80" }]
        }
    ]
},
{
    name: "Urban Burger Hub",
    description: "The ultimate destination for burger lovers. Juicy patties, fresh toppings, and our signature sauces.",
    cuisineTypes: ["American", "Fast Food"],
    address: {
        street: "88 Main Street",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001"
    },
    images: [{ url: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80" }],
    rating: 4.2,
    reviewsCount: 320,
    popularity: 85,
    isOpen: true,
    menuItems: [
        {
            name: "Classic Cheeseburger",
            description: "Beef patty with melted cheddar, lettuce, tomato, and pickles on a toasted brioche bun.",
            price: 299,
            category: "Burgers",
            cuisine: "American",
            isVeg: false,
            images: [{ url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" }]
        },
        {
            name: "Veggie Delight Burger",
            description: "Crispy vegetable patty with fresh greens and a tangy herb spread.",
            price: 249,
            category: "Burgers",
            cuisine: "American",
            isVeg: true,
            images: [{ url: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=500&q=80" }]
        },
        {
            name: "Loaded Fries",
            description: "Crispy fries topped with melted cheese, jalapeños, and crispy onions.",
            price: 199,
            category: "Sides",
            cuisine: "American",
            isVeg: true,
            images: [{ url: "https://images.unsplash.com/photo-1534422298391-e4f8c170db76?auto=format&fit=crop&w=500&q=80" }]
        }
    ]
},
{
    name: "Sushi Zen",
    description: "Exquisite Japanese cuisine prepared with the finest fish and traditional techniques.",
    cuisineTypes: ["Japanese", "Sushi"],
    address: {
        street: "12 Sakura Lane",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001"
    },
    images: [{ url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80" }],
    rating: 4.9,
    reviewsCount: 95,
    popularity: 95,
    isOpen: true,
    menuItems: [
        {
            name: "Salmon Nigiri",
            description: "Fresh slices of salmon over hand-pressed vinegared rice.",
            price: 550,
            category: "Sushi",
            cuisine: "Japanese",
            isVeg: false,
            images: [{ url: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=500&q=80" }]
        },
        {
            name: "Dragon Roll",
            description: "Shrimp tempura roll topped with avocado and sweet eel sauce.",
            price: 750,
            category: "Sushi",
            cuisine: "Japanese",
            isVeg: false,
            images: [{ url: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=500&q=80" }]
        },
        {
            name: "Miso Soup",
            description: "Traditional Japanese soup with tofu, seaweed, and green onions.",
            price: 150,
            category: "Appetizer",
            cuisine: "Japanese",
            isVeg: true,
            images: [{ url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80" }]
        }
    ]
},
{
    name: "The Pizza Crust",
    description: "Hand-tossed sourdough pizzas baked in an authentic wood-fired oven for a perfect thin crust.",
    cuisineTypes: ["Italian", "Pizza"],
    address: {
        street: "22 Piazza Avenue",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001"
    },
    images: [{ url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80" }],
    rating: 4.6,
    reviewsCount: 180,
    popularity: 90,
    isOpen: true,
    menuItems: [
        {
            name: "Margherita Pizza",
            description: "San Marzano tomatoes, fresh mozzarella, and aromatic basil leaves.",
            price: 499,
            category: "Pizza",
            cuisine: "Italian",
            isVeg: true,
            images: [{ url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=500&q=80" }]
        },
        {
            name: "Pepperoni Passion",
            description: "Spicy pepperoni, mozzarella, and a robust tomato sauce.",
            price: 599,
            category: "Pizza",
            cuisine: "Italian",
            isVeg: false,
            images: [{ url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80" }]
        },
        {
            name: "Tiramisu",
            description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
            price: 350,
            category: "Dessert",
            cuisine: "Italian",
            isVeg: true,
            images: [{ url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=500&q=80" }]
        }
    ]
},
{
    name: "Healthy Bites",
    description: "Nourish your body with our wide range of fresh salads, bowls, and cold-pressed juices.",
    cuisineTypes: ["Healthy", "Salads"],
    address: {
        street: "5 Wellness Plaza",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500001"
    },
    images: [{ url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80" }],
    rating: 4.7,
    reviewsCount: 145,
    popularity: 82,
    isOpen: true,
    menuItems: [
        {
            name: "Quinoa Salad Bowl",
            description: "Organic quinoa with roasted vegetables, avocado, and a lemon-tahini dressing.",
            price: 399,
            category: "Healthy",
            cuisine: "Healthy",
            isVeg: true,
            images: [{ url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80" }]
        },
        {
            name: "Avocado Toast",
            description: "Smashed avocado on sourdough bread with pumpkin seeds and chili flakes.",
            price: 349,
            category: "Breakfast",
            cuisine: "Healthy",
            isVeg: true,
            images: [{ url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80" }]
        },
        {
            name: "Green Smoothie",
            description: "Spinach, banana, apple, and ginger blended for a refreshing energy boost.",
            price: 199,
            category: "Beverages",
            cuisine: "Healthy",
            isVeg: true,
            images: [{ url: "https://images.unsplash.com/photo-1515276481942-f2d4b6848491?auto=format&fit=crop&w=500&q=80" }]
        }
    ]
}
];

const seedData = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/food_delivery_db";
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        // Get an owner user
        const owner = await User.findOne({ roles: "owner" });
        if (!owner) {
            console.log("No owner user found. Please create one first.");
            process.exit(1);
        }

        // Clear existing data for a clean seed
        await Restaurant.deleteMany({});
        await MenuItem.deleteMany({});
        console.log("Cleared existing restaurants and menu items.");

        for (const resData of industryData) {
            const { menuItems, ...restaurantInfo } = resData;

            const restaurant = new Restaurant({
                ...restaurantInfo,
                owner: owner._id,
                isApproved: true,
                menuItems: []
            });

            await restaurant.save();

            for (const itemData of menuItems) {
                const menuItem = new MenuItem({
                    ...itemData,
                    restaurant: restaurant._id,
                    createdBy: owner._id
                });
                await menuItem.save();
                restaurant.menuItems.push(menuItem._id);
            }

            await restaurant.save();
            console.log(`Seeded restaurant: ${restaurant.name}`);
        }

        console.log("Seeding completed successfully with industry-ready data.");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedData();
