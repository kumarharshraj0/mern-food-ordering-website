const testRegex = (input, storedValues) => {
    const cuisines = input.split(",");
    const regexes = cuisines.map(c => new RegExp(`^${c.trim()}$`, "i"));

    return storedValues.filter(val =>
        regexes.some(re => re.test(val))
    );
};

const storedCuisines = ["Italian", "chinese", "Indian", "Japanese", "Dessert"];

console.log("Testing with 'Italian':", testRegex("Italian", storedCuisines));
console.log("Testing with 'italian':", testRegex("italian", storedCuisines));
console.log("Testing with 'Chinese':", testRegex("Chinese", storedCuisines));
console.log("Testing with 'chinese':", testRegex("chinese", storedCuisines));
console.log("Testing with 'Italian,Chinese':", testRegex("Italian,Chinese", storedCuisines));
console.log("Testing with 'italian, chinese ':", testRegex("italian, chinese ", storedCuisines));
