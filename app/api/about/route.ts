import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { About } from '@/lib/db/models';

// GET about info
export async function GET() {
  try {
    await connectDB();
    let about = await About.findOne({});
    
    if (!about) {
      about = await About.create({
        bio: 'Welcome to my portfolio',
        skills: [],
        experience: '',
        location: '',
      });
    }
    
    return NextResponse.json(about, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch about' },
      { status: 500 }
    );
  }
}

// PUT update about (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const adminToken = request.headers.get('authorization');
    if (!adminToken || !process.env.ADMIN_SECRET || adminToken !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await request.json();

    let about = await About.findOne({});
    
    if (!about) {
      about = await About.create(data);
    } else {
      Object.assign(about, data);
      await about.save();
    }

    return NextResponse.json(about, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update about' },
      { status: 500 }
    );
  }
}
