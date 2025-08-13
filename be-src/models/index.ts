import { User } from "./user";
import { Pet } from "./pet";
User.hasMany(Pet);
Pet.belongsTo(User);
export { User, Pet };
