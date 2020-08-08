export const genFullName = (entity?: Inmate | Contact): string =>
  entity ? `${entity.firstName} ${entity.lastName}` : "";

export const genImageUri = (user?: User): string => {
  return user?.imageUri || "default.jpg";
};
