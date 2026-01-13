import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

async function main() {
  const p = new PrismaClient()

  // Check if admin already exists
  const existing = await p.user.findFirst({
    where: { email: 'admin@analyticaos.com' }
  })

  if (existing) {
    console.log('Admin user already exists:', existing.email)
    // Update password instead
    const hashedPassword = await bcrypt.hash('Admin@123', 10)
    await p.user.update({
      where: { id: existing.id },
      data: { passwordHash: hashedPassword }
    })
    console.log('Password reset to: Admin@123')
    return
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10)

  const admin = await p.user.create({
    data: {
      email: 'admin@analyticaos.com',
      username: 'admin',
      userId: 'ADMIN001',
      firstName: 'System',
      lastName: 'Administrator',
      passwordHash: hashedPassword,
      emailVerified: new Date()
    }
  })

  console.log('✅ Admin created successfully!')
  console.log('Email: admin@analyticaos.com')
  console.log('Password: Admin@123')
}

main().catch(console.error)
