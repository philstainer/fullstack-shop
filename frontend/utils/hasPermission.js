const hasPermission = (user, permissionsNeeded) => {
  const matchedPermissions =
    user?.permissions?.filter(permissionTheyHave =>
      permissionsNeeded.includes(permissionTheyHave),
    ) || []

  return matchedPermissions.length > 0
}

export default hasPermission
