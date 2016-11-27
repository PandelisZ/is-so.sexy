
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
		var music = '/music/audio2.mp3'
		if (shrine.music){
			music = '/music/' + shrine.music
		}

		res.render('shrine/default', {
			title: shrine.name + ' is so sexy!',
			description: shrine.description,
			images: JSON.stringify(uploads),
			music: music
		})
	}else {
		res.render('home', {
	    title: 'Home'
	  });
	}

};
