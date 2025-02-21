import codonTables from './codon-tables.json';

interface OptimizationResult {
  optimizedSequence: string;
  cai: number;
  gcContent: number;
}

export function optimizeSequence(sequence: string, organism: string): OptimizationResult {
  // Normalize sequence to uppercase and remove whitespace
  sequence = sequence.toUpperCase().replace(/\s+/g, '');
  
  // Get codon table for the organism
  const codonTable = codonTables[organism as keyof typeof codonTables];
  if (!codonTable) {
    throw new Error(`Codon table not found for organism: ${organism}`);
  }

  // Split sequence into codons
  const codons = sequence.match(/.{1,3}/g) || [];
  
  // Optimize each codon
  const optimizedCodons = codons.map(codon => {
    if (codon.length !== 3) return codon; // Handle incomplete codons
    
    // Get all possible codons for this amino acid
    const aminoAcid = translateCodon(codon);
    const possibleCodons = Object.keys(codonTable)
      .filter(c => translateCodon(c) === aminoAcid);
      
    // Select the codon with highest frequency
    return possibleCodons.reduce((maxCodon, currentCodon) => 
      codonTable[currentCodon as keyof typeof codonTable] > 
      codonTable[maxCodon as keyof typeof codonTable] ? 
      currentCodon : maxCodon
    );
  });

  const optimizedSequence = optimizedCodons.join('');
  
  return {
    optimizedSequence,
    cai: calculateCAI(optimizedSequence, organism),
    gcContent: calculateGCContent(optimizedSequence)
  };
}

export function calculateCAI(sequence: string, organism: string): number {
  const codonTable = codonTables[organism as keyof typeof codonTables];
  const codons = sequence.match(/.{1,3}/g) || [];
  
  let product = 1;
  let count = 0;
  
  codons.forEach(codon => {
    if (codon.length === 3 && codonTable[codon as keyof typeof codonTable]) {
      product *= codonTable[codon as keyof typeof codonTable];
      count++;
    }
  });

  return count > 0 ? Math.pow(product, 1/count) : 0;
}

export function calculateGCContent(sequence: string): number {
  const gcCount = (sequence.match(/[GC]/gi) || []).length;
  return sequence.length > 0 ? gcCount / sequence.length : 0;
}

function translateCodon(codon: string): string {
  const codonMap: { [key: string]: string } = {
    'ATA':'I', 'ATC':'I', 'ATT':'I', 'ATG':'M',
    'ACA':'T', 'ACC':'T', 'ACG':'T', 'ACT':'T',
    'AAC':'N', 'AAT':'N', 'AAA':'K', 'AAG':'K',
    'AGC':'S', 'AGT':'S', 'AGA':'R', 'AGG':'R',                
    'CTA':'L', 'CTC':'L', 'CTG':'L', 'CTT':'L',
    'CCA':'P', 'CCC':'P', 'CCG':'P', 'CCT':'P',
    'CAC':'H', 'CAT':'H', 'CAA':'Q', 'CAG':'Q',
    'CGA':'R', 'CGC':'R', 'CGG':'R', 'CGT':'R',
    'GTA':'V', 'GTC':'V', 'GTG':'V', 'GTT':'V',
    'GCA':'A', 'GCC':'A', 'GCG':'A', 'GCT':'A',
    'GAC':'D', 'GAT':'D', 'GAA':'E', 'GAG':'E',
    'GGA':'G', 'GGC':'G', 'GGG':'G', 'GGT':'G',
    'TCA':'S', 'TCC':'S', 'TCG':'S', 'TCT':'S',
    'TTC':'F', 'TTT':'F', 'TTA':'L', 'TTG':'L',
    'TAC':'Y', 'TAT':'Y', 'TAA':'_', 'TAG':'_',
    'TGC':'C', 'TGT':'C', 'TGA':'_', 'TGG':'W'
  };
  
  return codonMap[codon] || '';
}
