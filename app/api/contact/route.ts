import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Contact } from '@/lib/db/models';

// GET contact info
export async function GET() {
  try {
    await connectDB();
    let contact = await Contact.findOne({});
    
    if (!contact) {
      contact = await Contact.create({
        email: 'your@email.com',
        phone: '',
        linkedin: '',
        github: '',
        twitter: '',
      });
    }
    
    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

// PUT update contact (Admin only)
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

    let contact = await Contact.findOne({});
    
    if (!contact) {
      contact = await Contact.create(data);
    } else {
      Object.assign(contact, data);
      await contact.save();
    }

    return NextResponse.json(contact, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update contact' },
      { status: 500 }
    );
  }
}
