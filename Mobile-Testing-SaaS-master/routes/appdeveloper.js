var mysql=require('./mysql');

///////////New Project//////////////////////
exports.newProject = function(req, res){
	
	console.log("for creating new project ");	
	var ad_email = req.param("ad_email");
	var platform = req.param("platform");
	var app_name = req.param("app_name");
	var description = req.param("description");
	var no_of_testers = req.param("no_of_testers");
	var language_preference = req.param("language_preference");
	var project_testing_type = req.param("project_testing_type");
	var project_bugdet = req.param("project_bugdet");
	var Project_duration = req.param("Project_duration");
	var project_access_area = req.param("project_access_area");
	var report_access_area = req.param("report_access_area");
	var project_status='P';
	
	var myquery = "insert into app_project_setup (ad_email,platform,app_name,description,no_of_testers,language_preference,project_testing_type,project_bugdet,Project_duration,project_access_area,report_access_area,project_status) values ('"+ad_email+"', '"+platform+"','"+app_name+"','"+description+"','"+no_of_testers+"','"+language_preference+"','"+project_testing_type+"','"+project_bugdet+"','"+Project_duration+"','"+project_access_area+"','"+report_access_area+"','"+project_status+"')";
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

} ;
	
	
//////////////Find tester///////////////////////////////	
exports.findTester = function(req, res){
	
	console.log("Inside findTester ");	
	var ad_email = req.param("ad_email");
	var app_name = req.param("app_name");
	console.log("ad_email: "+ad_email);
	console.log("app_name: "+app_name);
	
	
	var myquery= "select * from app_project_setup where app_name= '"+app_name+"' and ad_email= '"+ad_email+"'";
	
	mysql.fetchData(function(err,results){
		if(err)
			{
				throw err;
			}
		else
			{
				console.log(results);
				var no_of_testers=results[0].no_of_testers;
				var project_id= results[0].project_id;
				console.log(no_of_testers);
				console.log(project_id);
				
				var q1= "select * from tester_selection_temp where project_id= '"+project_id+"' and ap_email= '"+ad_email+"'";
			
			    mysql.fetchData(function(err,results){
				if(err)
					{
					throw err;
					}
				else
					{ 
					  console.log("resultsssssssssss:"+results);
					  if(results.length===0)
					  {
					    //If new entry in tester selection data- get number of testers app wants
						var q2="select u.*,t.* from users u, testers_data t where u.email=t.email_id and t.status='AV' order by rating desc limit "+no_of_testers+" " ;
						
						mysql.fetchData(function(err,results){
							if(err)
								{
									throw err;
								}
							else
								{
								console.log("new entry!!!!")
								console.log(results);
								res.send({"status":200,"detail":results});
								}	
							
						    },q2);    
						   
					   }
					  else
					  {   
					   //remove the number of testers already assigned and give remaining testers in option
					   
					    var q3= "select count(*) as count from tester_selection_temp where project_id= '"+project_id+"' and ap_email='"+ad_email+"' and ap_status='Y' and tr_status in('P','A')";
					    mysql.fetchData(function(err,results){
							if(err)
								{
									throw err;
								}
							else
								{
								console.log(results);//this should give the count of testers which are either selected or pending for approval from tester's side
								var count=results[0].count;
								var new_nf_testers= no_of_testers-count;
								console.log("new_nf_testers: "+new_nf_testers);
								
								
								if(new_nf_testers > 0){ 
									var q4="select u.*,t.* from users u, testers_data t where u.email=t.email_id and t.status='AV' and u.email not in(select tr_email from tester_selection_temp where tr_status in('P','R','n')) order by rating desc limit "+new_nf_testers+" " ;
									
									mysql.fetchData(function(err,results){
										if(err)
											{
												throw err;
											}
										else
											{
											console.log("Not New entry!!!!")
											console.log(results);
												if(results.length===0){
												
												console.log("not enough testers in system at this point of time , Please try again");
												res.send({"status":500});
												}
												else{
												res.send({"status":200,"detail":results});
												}
											}	
										
									    },q4);
									
								 }
								else{
									console.log("Testers already assigned , can't assign more testers for this application");
									res.send({"status":100});
									
								}
								
								
								}	
							
						    },q3);
					    
					     }//else closing if results is not null

					}
			},q1);
				
				
			}
	},myquery);
};



///////////////////////Accept Tester////////////////////////////////////
exports.acceptTester = function(req, res){

	console.log("Inside accept tester ");
	var ap_email = req.param("ap_email");
	var app_name = req.param("app_name");
	var data= req.param("data");
	var project_id;
	var i=0;
//	var num_of_testers;  //total number of tester's needed for the project
//	var count= req.param("count"); //count of tester's got selected


    var q1= "select project_id from app_project_setup where app_name= '"+app_name+"' and ad_email= '"+ap_email+"'";
	
	mysql.fetchData(function(err,results){
		if(err)
			{
				throw err;
			}
		else
			{
				console.log(results);
				
				project_id=results[0].project_id;
				console.log("project_id111 :"+project_id);
				//num_of_testers=results[0].no_of_testers;
				//console.log("num_of_testers: "+num_of_testers);
				
	            while(i in data){
	            	
		            var tr_email=data[i].email_id;
		            var selected=data[i].selected;
		            var projectid=project_id;
					console.log("project_id2222 :"+projectid);
					console.log("selected: "+selected);
		            
			            if (selected==true){
			            var ap_status='Y';
			            var tr_status='P';
			             }
			             else{
			             var ap_status='N';
			 	         var tr_status= null; 
			            	 
			             }
						var q3="insert into tester_selection_temp(project_id,tr_email,ap_email,ap_status,tr_status) values ('"+projectid+"', '"+tr_email+"','"+ap_email+"','"+ap_status+"','"+tr_status+"')";
						mysql.fetchData(function(err,results){
							if(err)
								{
									throw err;
								}
							else
								{
								console.log(results);
				
								}	
							
						    },q3);
					
					i++
	               }
				
				res.send({"status":200});
			}
	  
	},q1);
};


///////////runningProjects///////////////////////////////

exports.runningProjects = function(req,res){

	console.log("Inside runningProjects ");
	var ad_email = req.param("ad_email");
	console.log(ad_email);
	

	var myquery= "select * from app_project_setup where ad_email= '"+ad_email+"'";

	mysql.fetchData(function(err,results){
	if(err){
			throw err;
	}

	else{
			console.log(results);
			res.send({"status":200,"detail":results});
	}	
	
	},myquery);
};



/////////////////////////Billing//////////////////////////////////
exports.billing = function(req,res){

	console.log("Inside billing ");
	var ad_email = req.param("ad_email");
	var app_name = req.param("app_name");
	console.log(ad_email);
	console.log(app_name);

	var myquery= "select * from app_project_setup where app_name= '"+app_name+"' and ad_email= '"+ad_email+"'";

	mysql.fetchData(function(err,results){
	if(err){
			throw err;
	}

	else{
			console.log(results);

			var project_id=results[0].project_id;
			console.log("project_id :"+project_id);

			var myquery2="select wf.*,tr.rating,ap.* from app_workflow wf, testers_data tr, app_project_setup ap where ap.project_id = wf.project_id and tr.email_id = wf.tr_email and wf.project_id='"+project_id+"'";

			mysql.fetchData(function(err,results){
				if(err)
				{
				throw err;
				}
				else{
					console.log(results);
				
					if(results.length===0){
					console.log("Project not yet started");
					res.send({"status":100});
					}
					else{
					res.send({"status":200,"detail":results});
					}
				}
			},myquery2);

	}

	},myquery);

};


/////////////////////////BillingClosure///////////////////////////
exports.billingClosure = function(req,res){

	console.log("Inside billing closure");
	var totalPoints = 0;
	var i = 0;
	var data=req.param("data");
    var project_id= data[0].project_id
	console.log("data.length:"+data.length);
	console.log("project_id:"+project_id);

	for (i = 0; i < data.length; i++) {
		data[i].points = 10 + parseInt(data[i].points);
		totalPoints += data[i].points;
		console.log(totalPoints);
	}

	for (i = 0; i < data.length; i++) {
		console.log(data[i].project_bugdet);
		data[i].pay = (data[i].project_bugdet / totalPoints) * data[i].points;
		console.log(" data[i].pay"+ data[i].pay);
		data[i].rating += (data[i].points/2);
		console.log(data[i].pay);
		console.log("pay: $" + data[i].pay.toFixed(2) + " rating: " + data[i].rating + "\n");
		
		var finalpay= data[i].pay.toFixed(2);
		var finalpoints= data[i].points;
		var tr_email= data[i].tr_email;
		var rating=data[i].rating;
		var q1="update app_workflow set pay='"+finalpay+"',points='"+finalpoints+"' where Project_id='"+project_id+"' and tr_email='"+tr_email+"';"
		mysql.fetchData(function(err,results){
			if(err)
			{
			throw err;
			}
			else{
				//console.log(results);
				console.log("updated");
				//res.send({"status":100});	
			}
		},q1);
		
		
		var myquery2 = "update testers_data set status = 'AV',rating ="+rating +" where email_id = '"+tr_email+"'";
		mysql.fetchData(function(err,results){
			if(err)
				{
					throw err;
				}
			else
				{
				console.log(results);
				console.log("updated");
				}
			
		},myquery2);
		
	}
	
	
	var q2= "update app_project_setup set project_status='C' where  Project_id='"+project_id+"';"
	mysql.fetchData(function(err,results){
		if(err)
		{
		throw err;
		}
		else{
			//console.log(results);
			console.log("updated");
			//res.send({"status":100});	
		}
	},q2);
	
	
	var q3= "update tester_selection_temp set tr_status='C' where ap_status='Y' and Project_id='"+project_id+"';"
	mysql.fetchData(function(err,results){
		if(err)
		{
		throw err;
		}
		else{
			//console.log(results);
			console.log("updated");
			//res.send({"status":100});	
		}
	},q3);
	
	var detail=data;
	console.log("end Rank and Pay");
	res.send({"status":200,"detail":detail});	
		
	
};