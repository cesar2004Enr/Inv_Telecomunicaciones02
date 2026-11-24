export const validarCredenciales = ({ usuario, password }) => {
  if (!usuario.trim() || !password.trim()) {
    alert("Por favor, rellena todos los campos.");
    return false;
  }

  return true;
};
