import { NextApiResponseServerIO } from "@/types/next";
import type { NextApiRequest } from "next";
import UsersSQL from "@/serverlib/sql-classes/users";
import { setLoginSession } from "@/serverlib/auth";
import { ApiResponse } from "@/types/apiResponse";
import { removeTokenCookie } from "@/serverlib/authCookies";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponseServerIO<ApiResponse>
) {
  removeTokenCookie(res)

  res.redirect("/");
}
