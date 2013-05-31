var dbase = [];

exports.find = function(id) {
	for (var i=0; i < dbase.length; i++) {
		if (dbase[i].id == id) {
			return dbase[i];
		}
	}
};

exports.update = function(id, jsonObj) {
	for (var i=0; i < dbase.length; i++) {
		if (dbase[i].id == id) {
			dbase[i].surname = jsonObj.surname;
			dbase[i].postal_address = jsonObj.postal_address;
		}
	}
};

exports.save = function(jsonObj) {
	return dbase.push(jsonObj);
};

exports.all = dbase;

exports.remove = function(id) {
	for (var i=0; i < dbase.length; i++) {
		if (dbase[i].id == id) {
			return dbase.splice(i, 1);
		}
	}
}

