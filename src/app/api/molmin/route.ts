import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const API_KEY = process.env.NVIDIA_API_KEY; // Get the API key from environment variables
  const invokeUrl = 'https://health.api.nvidia.com/v1/biology/nvidia/molmim/generate';

  const payload = await request.json();

  try {
    const response = await fetch(invokeUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data from NVIDIA API:', error);
    return NextResponse.error();
  }
}
