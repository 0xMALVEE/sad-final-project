import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Using the newer App Router pattern
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    // Delete the message from the database
    await db.delete(messages).where(eq(messages.id, id));
    
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error deleting message:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to delete message' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 