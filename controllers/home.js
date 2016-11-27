/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
	console.log(req.shrine);
  res.render('home', {
    title: 'Home'
  });
};
