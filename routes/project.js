// GET Projects by UserID
exports.byUser = function (req, res) {
  console.log("Getting user projects");
  if (req.params.userid){
    Project.findByUserID(
      req.params.userid,
      function (err, projects) {
        if(!err){
          console.log(projects);
          res.json(projects);
        }else{
          console.log(err);
          res.json({"status":"error", "error":"Error finding projects"});
        }
    })
  }else{
    console.log("No user id supplied");
    res.json({"status":"error", "error":"No user id supplied"});
  }
};

// GET project info
exports.displayInfo = function(req, res) {
  console.log("Finding project _id: " + req.params.id);
  if (req.session.loggedin !== "true"){
    res.redirect('/login');
  }
  else {
    if (req.params.id) {
      Project.findById( req.params.id, function(err,project) {
        if(err){
          console.log(err);
          res.redirect('/user?404=project');
        }else{
          console.log(project);
          res.render('project-page', {
            title: project.projectName,
            projectName: project.projectName,
            tasks: project.tasks,
            createdBy: project.createdBy,
            projectID: req.params.id
          });
        }
      });
    }else{
      res.redirect('/user');
    }
  }
};
