//core/src/components/WordSpinner.ts
export class WordSpinner {
    private combinations: string[] = ['Spin', 'the', 'Wheel'];
    private currentAngle: number = 0;
    private spinning: boolean = false;
  
    setCombinations(combinations: string[]) {
        this.combinations = combinations.length > 0 ? combinations : ['Spin', 'the', 'Wheel'];
    }

    generateCombinations(input: string, outputType: string): string[] {
        const words = this.validateInput(input);
        let permutations: string[] = [];

        switch (outputType) {
            case 'all':
                if (words.length < 2) {
                    throw new Error('At least 2 words are needed for combinations');
                }
                for (let i = 2; i <= Math.min(5, words.length); i++) {
                    permutations = permutations.concat(this.getPermutations(words, i));
                }
                break;
            case 'pairs':
                if (words.length < 2) {
                    throw new Error('At least 2 words are needed for pairs');
                }
                permutations = this.getPermutations(words, 2);
                break;
            case 'triplets':
                if (words.length < 3) {
                    throw new Error('At least 3 words are needed for triplets');
                }
                permutations = this.getPermutations(words, 3);
                break;
            case 'quads':
                if (words.length < 4) {
                    throw new Error('At least 4 words are needed for quads');
                }
                permutations = this.getPermutations(words, 4);
                break;
            case 'quints':
                if (words.length < 5) {
                    throw new Error('At least 5 words are needed for quints');
                }
                permutations = this.getPermutations(words, 5);
                break;
            default:
                throw new Error('Invalid output type');
        }

        return permutations;
    }

    private getPermutations(words: string[], size: number): string[] {
        if (size > words.length) return [];
        
        const permutations: string[] = [];

        const generatePermutation = (arr: string[], m: string[] = []) => {
            if (m.length === size) {
                permutations.push(m.join(' '));
                return;
            }
            
            for (let i = 0; i < arr.length; i++) {
                const curr = arr.slice();
                const next = curr.splice(i, 1);
                generatePermutation(curr, m.concat(next));
            }
        }

        generatePermutation(words);
        return permutations;
    }

    validateInput(input: string): string[] {
        const words = input.split('\n').filter(word => word.trim() !== '');
        if (words.length > 12) {
            throw new Error("For best performance, please limit input to 12 words or fewer.");
        }
        return words;
    }
  
  
      generateCombinationsArray(words: string[], outputType: string): string[] {
          const combinations = new Set<string>();
  
          function generatePermutations(arr: string[], size: number): string[][] {
              if (size === 1) {
                  return arr.map(word => [word]);
              }
  
              return arr.flatMap((first, i) => {
                  const rest = arr.slice(0, i).concat(arr.slice(i + 1));
                  return generatePermutations(rest, size - 1).map(perm => [first, ...perm]);
              });
          }
  
          function addCombinations(size: number) {
              generatePermutations(words, size).forEach(perm => {
                  combinations.add(perm.join(' '));
              });
          }
  
          switch(outputType) {
              case 'pairs':
                  addCombinations(2);
                  break;
              case 'triplets':
                  addCombinations(3);
                  break;
              default:
                  for (let i = 1; i <= words.length; i++) {
                      addCombinations(i);
                  }
          }
  
          return Array.from(combinations);
      }
  
      getRandomColor(): string {
        return `hsl(${Math.random() * 360}, 70%, 70%)`;
    }
  
    spin(): Promise<string> {
        return new Promise((resolve) => {
            const spinAngle = 3600 + Math.random() * 360;
            const duration = 5000;
            const startAngle = this.currentAngle;
            const startTime = Date.now();

            this.spinning = true;

            const animate = () => {
                const elapsedTime = Date.now() - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const easedProgress = this.easeOutCubic(progress);
                
                this.currentAngle = (startAngle + spinAngle * easedProgress) % 360;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.spinning = false;
                    const selectedIndex = this.getSelectedIndex();
                    resolve(this.combinations[selectedIndex] || 'No combination selected');
                }
            };

            requestAnimationFrame(animate);
        });
    }

    getCurrentRotation(): number {
        return this.currentAngle;
    }

    isSpinning(): boolean {
        return this.spinning;
    }


    private getSelectedIndex(): number {
        if (this.combinations.length === 0) return -1;
        const segmentAngle = 360 / this.combinations.length;
        const adjustedAngle = this.currentAngle % 360;
        return Math.floor(adjustedAngle / segmentAngle);
    }

    private easeOutCubic(t: number): number {
        return 1 - Math.pow(1 - t, 3);
    }

    private getCombinations(words: string[], size: number): string[] {
        if (size > words.length) return [];
        
        const combinations: string[] = [];
        const indices = Array(size).fill(0);
        let done = false;

        while (!done) {
            combinations.push(indices.map(i => words[i]).join(' '));

            for (let i = size - 1; i >= 0; i--) {
                if (indices[i] < words.length - (size - i)) {
                    indices[i]++;
                    for (let j = i + 1; j < size; j++) {
                        indices[j] = indices[j - 1] + 1;
                    }
                    break;
                }
                if (i === 0) {
                    done = true;
                }
            }
        }

        return combinations;
    }
}
