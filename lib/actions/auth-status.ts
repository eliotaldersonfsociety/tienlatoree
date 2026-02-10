'use server'

import { getCurrentUser } from './login'

export async function getAuthStatus() {
  try {
    const user = await getCurrentUser()
    return { isLoggedIn: !!user }
  } catch (error) {
    return { isLoggedIn: false }
  }
}