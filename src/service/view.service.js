import CatchAsync from "../common/CatchAsync";

export const loginPage = CatchAsync(async (req, res, next) => {
  res.status(200).render("login");
});
