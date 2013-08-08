function Cal126(){
    var _self = this;

    _self.month = function(){ return _self.working_date.getMonth(); };
    _self.day = function(){   return _self.working_date.getDate(); };
    _self.year = function(){  return _self.working_date.getFullYear(); };
    _self.cal = function(){ return _self.split_by_weeks(); }

    _self.get_month_name = function(){
        var month_names = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov", "Dec"];
        return month_names[_self.month()];
    };

    _self.get_month_offset = function(){
        // Offset for first week
        var month = _self.month() + 1;
        var date = new Date(month + ' 1 ,' + _self.year());
        return date.getDay();
    };

    _self.get_month_len = function(){
        // hardcoded month len and feb ;)
        var total_feb = 28;

        if (_self.month() == 1){
            if ( ( _self.year() % 100 != 0) && 
                 ( _self.year() % 4   == 0) || 
                 ( _self.year() % 400 == 0)){

                total_feb = 29;
            }
        }

        _self.total_days = ["31", "" + total_feb,"31","30","31","30","31","31","30","31","30","31"];

        return _self.total_days[_self.month()];
    };

    _self.set_date = function(user_date){
        // Check user input
        if(user_date == undefined){
            _self.working_date = new Date();
        } else if ( user_date instanceof Date ) {
            _self.working_date = user_date;
        }
    };

    _self.split_by_weeks = function(){
        // Split int array into weeks,
        var days = _self.get_month_len()
        var offset = _self.get_month_offset();

        var week = [];
        var month = [];
        var offset_used = false;

        var i = 1;
        while ( i <= days ){
            // For first loop we append offset
            if ( offset_used == false ){
                while (offset > 0){
                    week.push(0);
                    offset_used = true;
                    offset --;
                }
            }

            // Append date to week
            week.push(i);

            // Last week append
            if( i == days ){
                while ( week.length != 7){
                    week.push(0);
                }
            }

            // And check for week len
            if(week.length == 7){
                month.push(week);
                week = [];
            }

            i++;
        }

        return month;
    };
}
