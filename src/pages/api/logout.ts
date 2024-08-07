import { NextApiResponseServerIO } from "@/types/next";
import type { NextApiRequest } from "next";
import { ApiResponse } from "@/types/apiResponse";
import { removeTokenCookie } from "@/serverlib/authCookies";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponseServerIO<ApiResponse>
) {
  removeTokenCookie(res)

  res.redirect("/");
}
