export async function getCurrentUser(req, res) {
    const _userId = req.user?.id;
    res.status(501).json({ success: false, message: "Not implemented" });
}
//# sourceMappingURL=user.controller.js.map