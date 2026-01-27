export const isAdminAuthenticated = (req, res, next) => {
    if (req.session.admin) {
        return next();
    }
    res.redirect("/user/login");
};
