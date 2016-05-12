
/*
 * GET home page.
 */

exports.tr_dashboard = function(req, res){
  res.render('testerdashboard', { title: 'testerdashboard' });
	//res.send("respond with a resource");
};

exports.ap_dashboard = function(req, res){
	  res.render('appdevdashboard', { title: 'appdevdashboard' });
		//res.send("respond with a resource");
};