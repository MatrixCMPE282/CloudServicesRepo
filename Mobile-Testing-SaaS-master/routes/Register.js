var results;
var results1;
var mysql=require('./mysql');

exports.checkLogin = function(req,res){
	console.log("checking session");
	if(req.session.type === 'T'){
		console.log("session is " + req.session.fname);
		console.log("mail of session is " + req.session.mail);
		
		var myquery = "select * from testers_data where email_id = '"+req.session.mail+"'";
		mysql.fetchData(function(err,results){
			if(err)
				{
					throw err;
				}
			else
				{
				console.log(results);
				if (results.length>0)
					{
					console.log("fetching rating");
					req.session.rating=results[0].rating;
					req.session.status1=results[0].status;
					console.log("aaaaaaaaaaaaaaaaaaaa");
					var myquery1 = "select * from  tester_selection_temp where tr_email = '"+req.session.mail+"' and tr_status = 'P' and ap_status = 'Y'";
					mysql.fetchData(function(err,results1){
						if(err)
							{
								throw err;
							}
						else
							{
							if (results1.length>0)
								{
								console.log("bbbbbbbbbbbbbbbbb");
								req.session.offer=results1.length;
								res.send({"status":200,"fname":req.session.fname,"lname":req.session.lname,"type":req.session.type,"mail":req.session.mail,"rating":req.session.rating,"offer":req.session.offer,"status1":req.session.status1});
								}
							else
								{
								console.log("cccccccccccccccccccc");
								console.log(req.session.fname);
								console.log(req.session.lname);
								console.log(req.session.type);
								console.log(req.session.mail);
								console.log(req.session.rating);
								console.log(req.session.offer);
								console.log(req.session.status1);
								
									req.session.offer=0;	
									res.send({"status":200,"fname":req.session.fname,"lname":req.session.lname,"type":req.session.type,"mail":req.session.mail,"rating":req.session.rating,"offer":req.session.offer,"status1":req.session.status1});
								}				
							}
					},myquery1);	
					
					
					
					}
				else
					{
//					console.log("Invalid details");
//					res.send({"value1":"Invalid Email Id or Password"});
					}
				}
			
		},myquery);
		
			
		}
	
	
	if(req.session.type === 'D'){
		console.log("session is " + req.session.fname);
		console.log("mail of session is " + req.session.mail);
		res.send({"status":200,"fname":req.session.fname,"lname":req.session.lname,"type":req.session.type,"mail":req.session.mail});
	}
}

exports.signin = function(req, res){
	var user = req.param("user");
	email=user.email;
	password=user.password;
		var myquery = "select * from users where email = '"+email+"' and password = '"+password+"'";
		mysql.fetchData(function(err,results){
			if(err)
				{
					throw err;
				}
			else
				{
				console.log(results);
				if (results.length>0)
					{
					req.session.fname=results[0].first_name;
					req.session.lname=results[0].last_name;
					req.session.type=results[0].user_type;
					req.session.mail=results[0].email;
	                var str=JSON.stringify(results);
					res.send({"status":200,"results":str});
					}
				else
					{
					console.log("Invalid details");
					res.send({"value1":"Invalid Email Id or Password"});
					}
				}
			
		},myquery);

	};
		  
exports.ap_signup = function(req, res){
	  res.render('signup');
	  console.log(new Date());
};



//exports.usersignup = function(req, res){
//	var email = req.param("email");
//	var password = req.param("password");
//	var name = req.param("name");
//    var id = 1;
//	
//	if (email === null)
//		{
//			res.render('');
//		}
//		var myquery = "insert into tester values ('"+id+"', '"+email+"','"+password+"','"+name+"')";
//		mysql.fetchData(function(err,results){
//			if(err)
//				{
//					throw err;
//				}
//			else
//				{
//				res.render('success');
//				}			
//		},myquery);
//	 
//};


//exports.upform = function(req, res){
//	res.send({"upval":upval}); 
//};





exports.signup = function(req, res){
	console.log("ankitaaaa");
	var user = req.param("user");
	console.log(user);
	console.log(user.tr_email);
	//res.send({"status":200});
//	var password = req.param("password");
		var myquery = "insert into users values ('"+user.email+"','"+user.password+"','"+user.fname+"','"+user.mname+"','"+user.lname+"','"+user.usertype+"','"+user.year+-+user.month+-+user.date+"','"+user.gender+"','"+user.adln1+"','"+user.adln2+"','"+user.city+"','"+user.state+"','"+user.country+"','"+user.contact+"','"+user.skype+"','"+user.timezone+"')";
		mysql.fetchData(function(err,results){
			if(err)
				{
					throw err;
				}
			else
				{
				if(user.usertype === 'T')
					{
				var query = "insert into testers_data values ('"+user.email+"','0','"+user.tr_p0+"','"+user.tr_p1+"','"+user.tr_p2+"','"+user.pri_lang+"','"+user.sec_lang+"','"+user.tr_t0+"','"+user.tr_t1+"','"+user.tr_t2+"','"+user.tr_t3+"','"+user.tr_t4+"','AV')";
					mysql.fetchData(function(err,results){
						if(err)
							{
								throw err;
							}
						else
							{
								console.log('enteries inserted in testers_data');
								res.render('index');
							}
					
					},query);
				}
				else
					{
					res.render('index');
					}
				}
		},myquery);
	};


	exports.logout = function(req,res){
		console.log("in logout");
		req.session.destroy(function(err)
				{
					if(err){
							console.log(err);
							}
					else
						{
						res.render('index');
						}
				});

	};
	