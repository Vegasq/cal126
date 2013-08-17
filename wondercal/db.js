// 
var DB = {
    'db': false,
    'get': function(){
        // if(this.db === false){
        //  this.db = openDatabase("wondercal", "0.1.0", "calendar settings.", 200000);
        // }
        // if(!this.db){
        //  console.log(this.db, '<<');
        //  return this.get();
        // }

        return localStorage;
    }
};

//
var Settings = function(){
    var _self = this;

    _self.init = function(){
        var linen = settings.get('lines');
        var linen = parseInt(linen, 10); 
        if(linen <= 0 || linen > 4){
            linen = 3;
        }
        document.getElementById('sw'+linen).className += " selected_setting ";
        _self.resize_to(linen);
        _self.resize_to(linen);


        var fday = settings.get('first_day');
        var fday = parseInt(fday, 10); 
        if(fday < 0 || fday > 2){
            fday = 1;
        }

        document.getElementById('fd'+fday).className += " selected_setting ";

    };

    _self.is_monday_first = function(){
        var fd = _self.get('first_day');
        if(fd == 1){
            return true;
        }
        return false;
    };

    _self.set = function(name, val){
        var db = DB.get();
        db[name] = val;
    };
    _self.get = function(name, callback){
        var db = DB.get();
        return db[name];
    };


    _self.settings_firstday = function(){
        var day_number = this.getAttribute('data-day');
        settings.set('first_day', day_number);

        var buttons = document.querySelectorAll('.fd_handle');
        for (var i = buttons.length - 1; i >= 0; i--) {
            buttons[i].className = buttons[i].className.replace(/\bselected_setting\b/,'');
        };
        document.getElementById('fd'+day_number).className += " selected_setting ";

        var d = new Date();
        init(d.getFullYear());
    };

    _self.settings_toggle = function(){
        var sb = document.getElementById('sidebar');
        if(sb.style.display == 'block'){
            sb.style.display = 'none';
        } else {
            sb.style.display = 'block';
        }
    };

    _self.settings_lines = function(){
        var line_number = this.innerHTML;
        if(line_number <= 0 || line_number > 4){
            line_number = 3;
        }

        settings.set('lines', line_number);

        var buttons = document.querySelectorAll('.sw_handle');
        for (var i = buttons.length - 1; i >= 0; i--) {
            buttons[i].className = buttons[i].className.replace(/\bselected_setting\b/,'');
        };

        document.getElementById('sw'+line_number).className += " selected_setting ";
        _self.resize_to(line_number);
        _self.resize_to(line_number);
    };

    _self.resize_to = function(val){
        var gui = require('nw.gui');
        var win = gui.Window.get();
        if (val == 2){
            win.resizeTo(1440, 570);
            win.setMaxListeners(1440, 570);
            win.setMinimumSize(1440, 570);
            document.getElementById('dragme').style.width = '1050px';
        } else if( val == 3){
            win.resizeTo(980, 850);
            win.setMaxListeners(980, 850);
            win.setMinimumSize(980, 850);
            document.getElementById('dragme').style.width = '600px';
        }
    };
};