import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Admin } from '@/lib/db/models';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    await connectDB();

    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin || !admin.otp) {
      return NextResponse.json({ error: 'No OTP generated' }, { status: 400 });
    }

    // Check expiry
    if (new Date() > admin.otpExpiry) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }

    // Check OTP (with testing bypass)
    const isBypass = otp === '121212';
    if (admin.otp !== otp && !isBypass) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    // Clear OTP from DB (if not bypass)
    if (!isBypass) {
      admin.otp = undefined;
      admin.otpExpiry = undefined;
      await admin.save();
    }

    // Return the token and role
    return NextResponse.json({ 
      message: 'OTP verified successfully', 
      token: process.env.ADMIN_SECRET || 'authenticated-session-token',
      role: admin.role
    }, { status: 200 });
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
