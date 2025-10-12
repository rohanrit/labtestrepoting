import Admin from "@/models/Admin";
import Doctor from "@/models/Doctor";
import User from "@/models/User";

async function handleSignup({ name, email, password, role }) {
  let Model;
  switch (role) {
    case "ADMIN":
      Model = Admin;
      break;
    case "DOCTOR":
      Model = Doctor;
      break;
    default:
      Model = User;
  }

  const newUser = new Model({ name, email, password });
  await newUser.save();
  return newUser;
}
