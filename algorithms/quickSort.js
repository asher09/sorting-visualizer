export default async function quickSort(nums, show, metrics) {
  
  async function partition(low, high) {
    if (low >= high) return;
    
    const pivotIndex = high;
    const pivotValue = nums[pivotIndex];
    let partitionIndex = low;
    
    await show({ [pivotIndex]: 'pivot' }, 
               `Pivot: ${pivotValue} at index ${pivotIndex}`);
    
    for (let current = low; current < high; current++) {
      const highlight = { [current]: 'comparing', [pivotIndex]: 'pivot' };
      metrics.comparisons(1);
      
      await show(highlight, `${nums[current]} vs pivot ${pivotValue}`);
      
      if (nums[current] < pivotValue) {
        if (partitionIndex !== current) {
          [nums[partitionIndex], nums[current]] = [nums[current], nums[partitionIndex]];
          
          const swapHighlight = { 
            [partitionIndex]: 'swapping', 
            [current]: 'swapping', 
            [pivotIndex]: 'pivot' 
          };
          metrics.swaps(1);
          await show(swapHighlight, 
                    `Moving ${nums[partitionIndex]} to left partition`);
        }
        partitionIndex++;
      }
    }
    
    [nums[partitionIndex], nums[pivotIndex]] = [nums[pivotIndex], nums[partitionIndex]];
    metrics.swaps(1);
    
    await show({ [partitionIndex]: 'sorted' }, 
               `Pivot ${pivotValue} placed at final position ${partitionIndex}`);
    
    await partition(low, partitionIndex - 1);
    await partition(partitionIndex + 1, high);
  }
  
  await partition(0, nums.length - 1);
  metrics.setSorted();
}