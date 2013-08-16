// 
var DB = {
	'db': false,
	'get': function(){
		if(this.db === false){
			this.db = openDatabase("wondercal", "0.1.0", "calendar settings.", 200000);
		}
		if(!this.db){
			console.log(this.db, '<<');
			return this.get();
		}

		return this.db;
	}
};

//
var Settings = function(){
	var _self = this;

	_self.init = function(tx){
		tx.executeSql("CREATE TABLE settings1261 (name TEXT, val TEXT)", [], function(){

		}, function(e,r){

		});
	};

	_self.set = function(name, val){
		var db = DB.get();

		db.transaction(function(tx) {
    		tx.executeSql('INSERT INTO settings1261 (name, val) VALUES ("'+name+'", "'+val+'")',[],function(){},function(a,b){
    			console.log(a,b);
    		});
		});
	};
	_self.get = function(name, callback){
		var db = DB.get();

		db.transaction(function (tx) {
		  tx.executeSql('SELECT * FROM settings1261 WHERE `name`="'+ name +'"', [], function (tx, results) {
		  	console.info(results, name);
		  	try{
			  	callback(results.rows.item(0).val);
		  	} catch(e){
		  		console.error(e);
		  		_self.set(name, '0');
		  		callback(0);
		  	}
	      }, function(er, ror){
		  	console.error(er,ror);
		  	_self.init(tx);
		  });
		});


	}
};