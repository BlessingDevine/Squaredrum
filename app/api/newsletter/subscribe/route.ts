import { NextRequest, NextResponse } from 'next/server'

// Simple newsletter subscription endpoint without external dependencies
export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()
    
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    // Log the subscription (in a real app, you'd save to database or send to email service)
    console.log('Newsletter subscription:', { 
      email, 
      name, 
      timestamp: new Date().toISOString() 
    })
    
    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter!' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}
