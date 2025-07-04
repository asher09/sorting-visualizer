export default async function insertionSort(array, animate, tracker) {
  const size = array.length;
  
  for (let i = 1; i < size; i++) {
    const keyValue = array[i];
    let position = i - 1;
    
    await animate({ [i]: 'comparing' }, 
                  `Inserting ${keyValue} into sorted portion`);
    
    while (position >= 0 && array[position] > keyValue) {
      tracker.comparisons(1);
      
      await animate({ [position]: 'comparing', [position + 1]: 'swapping' }, 
                    `${array[position]} > ${keyValue}, shifting right`);
      
      array[position + 1] = array[position];
      tracker.swaps(1);
      position--;
    }
    
    array[position + 1] = keyValue;
    await animate({ [position + 1]: 'swapping' }, 
                  `${keyValue} inserted at position ${position + 1}`);
  }
  
  tracker.setSorted();
}