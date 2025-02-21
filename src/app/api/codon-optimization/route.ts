import { optimizeSequence } from '@/lib/codon-optimization';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { sequence, organism } = await request.json();
    
    if (!sequence || !organism) {
      return NextResponse.json(
        { error: 'Sequence and organism are required' },
        { status: 400 }
      );
    }

    const result = optimizeSequence(sequence, organism);
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Optimization failed' },
      { status: 500 }
    );
  }
}
