/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
	console.log(req.shrines);
  res.render('home', {
    title: 'Home'
  });
};
