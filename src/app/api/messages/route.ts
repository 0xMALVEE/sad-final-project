import { NextResponse } from 'next/server';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allMessages = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(100);
    return NextResponse.json(allMessages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, content } = await request.json();
    
    if (!name || !content) {
      return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
    }
    
    const newMessage = await db.insert(messages).values({
      name,
      content,
    }).execute();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to post message:', error);
    return NextResponse.json({ error: 'Failed to post message' }, { status: 500 });
  }
} 