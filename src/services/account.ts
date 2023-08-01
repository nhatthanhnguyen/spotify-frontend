import axios from "axios";
import { GET_ACCOUNT_INFO } from "../api/account";

export const getAccountInfo = async (userId: number) => {
  return await axios.post(GET_ACCOUNT_INFO, {
    user_id: userId,
  });
};
