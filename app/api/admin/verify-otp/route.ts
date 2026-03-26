import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Admin } from '@/lib/db/models';
import { signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth';

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
    }

    // Generate Tokens
    const payload = { 
      userId: admin._id.toString(), 
      email: admin.email, 
      role: admin.role 
    };
    
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Save refresh token to DB
    admin.refreshToken = refreshToken; // In production, hash this before saving
    await admin.save();

    // Create Response
    const response = NextResponse.json({ 
      message: 'OTP verified successfully', 
      role: admin.role,
      user: {
        email: admin.email,
        role: admin.role
      }
    }, { status: 200 });

    // Set Cookies
    const cookies = setAuthCookies(accessToken, refreshToken);
    cookies.forEach(cookie => {
      response.headers.append('Set-Cookie', cookie);
    });

    return response;
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
