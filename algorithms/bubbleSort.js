export default async function bubbleSort(data, visualize, stats) {
  const len = data.length;
  
  for (let i = 0; i < len - 1; i++) {
    let didSwap = false; 
    
    for (let j = 0; j < len - i - 1; j++) {
      const activeElements = { [j]: 'comparing', [j + 1]: 'comparing' };
      stats.comparisons++;
      
      await visualize(activeElements, `Comparing ${data[j]} with ${data[j + 1]}`);
      
      if (data[j] > data[j + 1]) {
        [data[j], data[j + 1]] = [data[j + 1], data[j]];
        
        const swappingElements = { [j]: 'swapping', [j + 1]: 'swapping' };
        stats.swaps++;
        didSwap = true;
        
        await visualize(swappingElements, `Swapped! ${data[j]} and ${data[j + 1]}`);
      }
    }
    
    // mark position as sorted
    await visualize({ [len - i - 1]: 'sorted' }, `Position ${len - i - 1} is now sorted`);
    
    if (!didSwap) break;
  }
  
  stats.setSorted();
}