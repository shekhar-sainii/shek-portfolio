import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { UISettings } from '@/lib/db/models';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await connectDB();
    let settings = await UISettings.findOne();
    if (!settings) {
      settings = await UISettings.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch UI settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    let settings = await UISettings.findOne();
    if (!settings) {
      settings = await UISettings.create(data);
    } else {
      settings = await UISettings.findByIdAndUpdate(settings._id, data, { new: true });
    }
    
    // Purge cache for the Home page
    revalidatePath('/');
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to update UI settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
