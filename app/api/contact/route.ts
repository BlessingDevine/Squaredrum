import { NextRequest, NextResponse } from 'next/server'

// Simple contact form endpoint without external dependencies
export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
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
    
    // Log the contact form submission (in a real app, you'd save to database or send email)
    console.log('Contact form submission:', { 
      name, 
      email, 
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''), 
      timestamp: new Date().toISOString() 
    })
    
    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
