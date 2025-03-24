export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timer: NodeJS.Timeout;
  
    return (...args: Parameters<T>) => {
      clearTimeout(timer); // Clear previous timer
      timer = setTimeout(() => {
        func(...args); // Run function after delay
      }, delay);
    };
  }
  