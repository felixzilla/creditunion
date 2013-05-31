
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('app/index', { title: 'Credit Union App' });
};