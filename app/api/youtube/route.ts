import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = 'AIzaSyA59zx2HIq7AfnpKJ87vfQoTuZm2b9uUdw';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint required' }, { status: 400 });
  }

  // Build query params
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key !== 'endpoint') {
      params[key] = value;
    }
  });
  params.key = API_KEY;

  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, { params });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}
