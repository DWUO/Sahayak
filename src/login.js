
export function validateLogin(username, password) {
  if (!username.trim()) {
    return "Please enter your email or username.";
  }

  if (!password) {
    return "Please enter your password.";
  }

  if (
    username.includes("@") &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)
  ) {
    return "Please enter a valid email address.";
  }

  return "";
}
