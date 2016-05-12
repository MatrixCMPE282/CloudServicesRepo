var mysql=require('./mysql');

exports.test = function(req, res){
	var score = req.param("score");
	var email = req.param("email");
		var myquery = "update testers_data set rating = "+score+" where email_id = '"+email+"'";
		mysql.fetchData(function(err,results){
			if(err)
				{
					throw err;
				}
			else
				{
				console.log(results);
				res.send({"status":200});
				}
			
		},myquery);

	};
	
	
exports.newpro = function(req, res){
	var email = req.param("email");
		var myquery = "select ap.project_id,ap.app_name,ap.description,ap.project_testing_type,ap.project_duration,ap.ad_email from app_project_setup ap,tester_selection_temp sl where tr_status = 'P' and ap.project_id=sl.project_id and sl.tr_email = '"+email+"'";
		mysql.fetchData(function(err,results){
			if(err)
				{
					throw err;
				}
			else
				{
				console.log(results);
				res.send({"results":results});
				}
			
		},myquery);

	};
	
exports.nwpr_dec = function(req, res){
	console.log("for new project decision");
	var dec = req.param("dec");
	var email = req.param("email");
	var pid = req.param("pid");
	var fname = req.param("fname");
	var lname = req.param("lname");
		var myquery = "update tester_selection_temp set tr_status = '"+dec+"' where project_id ="+pid+" and tr_email= '"+email+"'";
		mysql.fetchData(function(err,results){
			if(err)
				{
					throw err;
				}
			else
				{
				console.log(results);
				}
			
		},myquery);
if(dec === "A")
	{
		var myquery1 = "insert into app_workflow (project_id,tr_email,first_name,last_name) values ("+pid+",'"+email+"','"+fname+"','"+lname+"')";
		mysql.fetchData(function(err,results){
			if(err)
				{
					throw err;
				}
			else
				{
				console.log(results);
				}
			
		},myquery1);
		
		var myquery2 = "update testers_data set status = 'NA' where email_id = '"+email+"'";
		mysql.fetchData(function(err,results){
			if(err)
				{
					throw err;
				}
			else
				{
				console.log(results);
				}
			
		},myquery2);
	}
res.send({"status":200});
}


	//function fetching App Description,Project Duration, App Name
	exports.curpro = function(req, res){
//		console.log("nfkjanfkjans");
		var tremail = req.param("email");
		
		myquery = 	"select aps.project_id,aps.description,aps.Project_duration,aps.app_name,aps.project_testing_type,aps.project_access_area,aps.report_access_area from app_project_setup aps join tester_selection_temp tst on aps.project_id = tst.project_id where tst.tr_status='A' and tst.tr_email = '"+tremail+"'";	
		mysql.fetchData(function(err,results){
				if(err)
					{
						throw err;
					}
				else
					{
//						res.send({"results":results});
						console.log(results[0]["project_id"]);
						myquery = 	"select * from bug where tr_email ='"+tremail+"' and project_id = "+results[0]["project_id"]+"";	
						mysql.fetchData(function(err,results1){
								if(err)
									{
										throw err;
									}
								else
									{
										res.send({"results":results,"results1":results1});
	//									console.log(results[0]["project_id"]);
										
									}
							},myquery);
					}
			},myquery);
}
	
	exports.profil = function(req, res){
		//console.log("nfkjanfkjans");
		var tremail = req.param("email");
		
		myquery = 	"select * from users u, testers_data t where u.email = t.email_id and t.email_id = '"+tremail+"'";	
		mysql.fetchData(function(err,results){
				if(err)
					{
						throw err;
					}
				else
					{
						console.log(results);
						res.send({"results":results});
					}
			},myquery);
}

	exports.bilpay = function(req, res){
		//console.log("nfkjanfkjans");
		var tremail = req.param("email");
		
		myquery = 	"select wf.pay,ap.app_name from app_workflow wf,app_project_setup ap where wf.project_id = ap.project_id and tr_email = '"+tremail+"'";	
		mysql.fetchData(function(err,results){
				if(err)
					{
						throw err;
					}
				else
					{
						console.log(results);
						res.send({"results":results});
					}
			},myquery);
}
	
	exports.repbug = function(req, res){
		//console.log("nfkjanfkjans");
		var email = req.param("email");
		var pid = req.param("pid");
		var bug = req.param("bug");
		console.log(bug.bugs_no);
		console.log(bug.bugs_desc);
		console.log(email);
		console.log(pid);
		  var today = new Date();
		  var dd = today.getDate();
		  var mm = today.getMonth() + 1;
		  var yy = today.getFullYear();
		  if (dd<10)
			  {
			  dd = '0'+dd
			  }
		  
		  if (mm<10)
		  {
		  mm = '0'+mm
		  }
		  today = yy+'-'+mm+'-'+dd;
		  
		myquery = 	"Insert into bug values ("+pid+",'"+email+"','"+today+"',"+bug.bugs_no+",'"+bug.bugs_desc+"')";	
		mysql.fetchData(function(err,results){
				if(err)
					{
						throw err;
					}
				else
					{
						console.log(results);
						res.send({"status":200});
					}
			},myquery);
}