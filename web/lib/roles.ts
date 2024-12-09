export const Roles = {
  ADMIN: 'ADMIN',
  LEADER: 'LEADER',
  MEMBER: 'MEMBER',
}

export const isAuthorizedToStartLive = (role: string): boolean => {
  return role === Roles.ADMIN || role === Roles.LEADER
}

export const canShareScreen = (role: string): boolean => {
  return role === Roles.ADMIN || role === Roles.LEADER
}
