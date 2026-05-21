import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const org = await prisma.organization.upsert({
    where: { slug: 'demo-acme' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'demo-acme',
      planId: 'starter',
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@acme.com' },
    update: {},
    create: {
      email: 'admin@acme.com',
      name: 'Admin User',
      passwordHash: await bcrypt.hash('Admin123!', 12),
      role: 'owner',
      organizationId: org.id,
    },
  });

  const chatbot = await prisma.chatbot.upsert({
    where: { id: 'demo-chatbot-1' },
    update: {},
    create: {
      id: 'demo-chatbot-1',
      name: 'Acme Support Bot',
      description: 'Main customer support chatbot',
      businessPreset: 'support',
      organizationId: org.id,
      isActive: true,
    },
  });

  await prisma.chatbotAppearance.upsert({
    where: { chatbotId: chatbot.id },
    update: {},
    create: {
      chatbotId: chatbot.id,
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      welcomeMessage: 'Hi there! 👋 How can I help you today?',
      headerStyle: 'gradient',
      headerGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    },
  });

  await prisma.chatbotBehavior.upsert({
    where: { chatbotId: chatbot.id },
    update: {},
    create: {
      chatbotId: chatbot.id,
      initialMessage: 'Hello! I\'m your support assistant. How can I help?',
      suggestedMessages: JSON.stringify([
        'What are your business hours?',
        'How do I reset my password?',
        'Track my order',
        'Talk to a human',
      ]),
      collectLeadInfo: true,
    },
  });

  await prisma.aIConfig.upsert({
    where: { chatbotId: chatbot.id },
    update: {},
    create: {
      chatbotId: chatbot.id,
      provider: 'openai',
      model: 'gpt-4o-mini',
      systemPrompt: 'You are a helpful customer support assistant for Acme Corp. Help users with their questions professionally and warmly.',
    },
  });

  await prisma.subscription.upsert({
    where: { organizationId: org.id },
    update: {},
    create: {
      organizationId: org.id,
      planId: 'starter',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Seed complete!');
  console.log(`   Org: ${org.name} (${org.slug})`);
  console.log(`   Admin: ${adminUser.email} / Admin123!`);
  console.log(`   Chatbot: ${chatbot.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
