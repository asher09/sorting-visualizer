export default async function selectionSort(arr, step, counters) {
  const n = arr.length;
  
  for (let currentPos = 0; currentPos < n - 1; currentPos++) {
    let minIndex = currentPos;
    
    await step({ [currentPos]: 'comparing' }, 
               `Looking for minimum from position ${currentPos}`);
    
    for (let j = currentPos + 1; j < n; j++) {
      const comparing = { [minIndex]: 'comparing', [j]: 'comparing' };
      counters.comparisons(1);
      
      await step(comparing, `Is ${arr[j]} < ${arr[minIndex]}?`);
      
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        await step({ [minIndex]: 'comparing' }, 
                   `New minimum found: ${arr[minIndex]}`);
      }
    }
    
    if (minIndex !== currentPos) {
      [arr[currentPos], arr[minIndex]] = [arr[minIndex], arr[currentPos]];
      
      const swapHighlight = { [currentPos]: 'swapping', [minIndex]: 'swapping' };
      counters.swaps(1);
      await step(swapHighlight, 
                `Moved ${arr[currentPos]} to position ${currentPos}`);
    }
    
    await step({ [currentPos]: 'sorted' }, `Position ${currentPos} locked in`);
  }
  
  counters.setSorted();
}