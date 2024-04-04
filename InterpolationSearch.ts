import { ToDoTask } from "./types";

export const interpolationSearch = (
  arr: ToDoTask[],
  searchDate: Date
): ToDoTask[] => {
  if (searchDate) {
    let left = 0;
    let right = arr.length - 1;
    searchDate.setHours(23);

    // Continue searching while the left index is less than or equal to the right index
    while (left <= right) {
      const interpolationIndex = Math.floor(
        left +
          ((right - left) /
            (arr[right].dueDate.getTime() - arr[left].dueDate.getTime())) *
            (searchDate.getTime() - arr[left].dueDate.getTime())
      );

      // Check if the interpolation index is out of bounds
      if (interpolationIndex < 0 || interpolationIndex >= arr.length) {
        return [];
      }

      // Compare the element at the interpolation index with the search value
      const currentItem = arr[interpolationIndex];
      const itemDate = new Date(currentItem.dueDate);

      if (
        itemDate.getMonth() === searchDate.getMonth() &&
        itemDate.getDate() === searchDate.getDate()
      ) {
        // Use Array.prototype.filter to filter elements that match the search date
        return arr.filter((item) => {
          const itemDate = new Date(item.dueDate);
          return (
            itemDate.getMonth() === searchDate.getMonth() &&
            itemDate.getDate() === searchDate.getDate()
          );
        });
      } else if (itemDate.getTime() < searchDate.getTime()) {
        left = interpolationIndex + 1;
      } else {
        right = interpolationIndex - 1;
      }
    }
  }

  // If the search value is not found, return an empty array
  return [];
};
