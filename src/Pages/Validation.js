export const validEmail=(email)=>{
if(!email.trim()){
    return "Enter Your Email ID!!!!"
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return "Please enter a valid email address";
}

return null;
}


export const validPassword=(password)=>{
    if(!password.trim()){
        return "Enter Your Password!!!!"
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character";
  }
  return null;
}