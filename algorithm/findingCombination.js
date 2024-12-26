function section3(l, t) {
	const result = []; // Store the valid combinations
	const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Digits to choose from

	/**
	 * Helper function to recursively explore combinations.
	 * @param {number} startIndex - Current position in the digits array.
	 * @param {number[]} currentCombination - Current combination being built.
	 * @param {number} currentSum - Current sum of the combination.
	 */
	function findCombinations(startIndex, currentCombination, currentSum) {
		// Base case: If the combination matches the requirements, add it to the result.
		if (currentCombination.length === l && currentSum === t) {
			result.push([...currentCombination]);
			return;
		}

		// If the combination exceeds length or sum, stop exploring further.
		if (currentCombination.length > l || currentSum > t) {
			return;
		}

		// Loop through digits starting from the current index to avoid duplicates.
		for (let i = startIndex; i < digits.length; i++) {
			currentCombination.push(digits[i]); // Add the digit to the combination
			findCombinations(i + 1, currentCombination, currentSum + digits[i]); // Recurse
			currentCombination.pop(); // Remove the last digit to backtrack
		}
	}

	// Start finding combinations
	findCombinations(0, [], 0);

	return result;
}

// Examples to test the function
console.log(section3(3, 6)); // [[1, 2, 3]]
console.log(section3(3, 8)); // [[1, 2, 5], [1, 3, 4]]
console.log(section3(4, 5)); // []
