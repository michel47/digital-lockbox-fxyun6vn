import seedWrapperImagePath from '/src/img/seed_wrapper.svg'

export async function generateSeedFromImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      
      if (file.type.includes('svg')) {
        const parser = new DOMParser();
        const svg = parser.parseFromString(dataUrl, 'image/svg+xml');
        const seedElement = svg.getElementById('seed');
        console.log(seedElement);
        
        if (seedElement?.dataset.seed) {
          resolve(seedElement.dataset.seed);
        } else {
          reject(new Error('Invalid SVG: missing seed data'));
        }
      } else {
        try {
          const response = await fetch(seedWrapperImagePath);
          const templateText = await response.text();
          const parser = new DOMParser();
          const template = parser.parseFromString(templateText, 'image/svg+xml');
          
          // Set the image
          const imageElement = template.getElementById('user-image');
          if (imageElement) {
            imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', dataUrl);
          }
          
          // Generate and set the seed
          const array = new Uint8Array(32);
          crypto.getRandomValues(array);
          const seed = btoa(String.fromCharCode(...array));
          
          const seedElement = template.getElementById('seed');
          if (seedElement) {
            seedElement.dataset.seed = seed;
          }
          console.log(imageElement);
          
          resolve(seed);
        } catch (error) {
          reject(new Error('Failed to process image'));
        }
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
