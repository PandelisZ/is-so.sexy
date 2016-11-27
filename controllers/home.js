
/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
	console.log(req.shrine);

	if(req.shrine){
		let shrine = req.shrine
		let uploads = shrine.images.map((img)=>{
			return '/uploads/'+img
		})
		res.render('shrine/default', {
			title: shrine.name + ' is so sexy!',
			description: shrine.description,
			images: JSON.stringify(uploads)
		})
	}else {
		res.render('home', {
	    title: 'Home'
	  });
	}

};
