const bcrypt = require('bcryptjs')
const { db } = require('./lib/db')
const { users } = require('./lib/schema')
const { eq } = require('drizzle-orm')

// Usage: node scripts/reset-admin-password.js <email> <newPassword>

async function resetAdminPassword() {
  const email = process.argv[2]
  const newPassword = process.argv[3]

  if (!email || !newPassword) {
    console.log('Usage: node scripts/reset-admin-password.js <email> <newPassword>')
    console.log('Example: node scripts/reset-admin-password.js silenny@latorreimperial.com admin123')
    process.exit(1)
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    const result = await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email))
      .returning({ id: users.id, email: users.email })

    if (result.length === 0) {
      console.log('❌ Usuario no encontrado')
      process.exit(1)
    }

    console.log(`✅ Contraseña actualizada para: ${result[0].email}`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

resetAdminPassword()
