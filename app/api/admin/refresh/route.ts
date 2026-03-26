import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Admin } from '@/lib/db/models';
import { verifyRefreshToken, signAccessToken, setAuthCookies } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token not found' }, { status: 401 });
    }

    await connectDB();

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }

    const admin = await Admin.findById(decoded.userId);
    if (!admin || admin.refreshToken !== refreshToken) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    // Generate new Access Token
    const payload = { 
      userId: admin._id.toString(), 
      email: admin.email, 
      role: admin.role 
    };
    
    const accessToken = signAccessToken(payload);

    // Create Response
    const response = NextResponse.json({ 
      message: 'Token refreshed successfully',
    }, { status: 200 });

    // Set Access Cookie (Updating refresh cookie as well to reset expiry if needed, or just access)
    const cookies = setAuthCookies(accessToken, refreshToken);
    cookies.forEach(cookie => {
      response.headers.append('Set-Cookie', cookie);
    });

    return response;
  } catch (error: any) {
    console.error('Refresh Token Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
