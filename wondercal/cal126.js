/**
 * @constructor
 */
function Cal126(date){
    var _self = this;

    if(date !== undefined){
        _self.working_date = date;
    }

    _self.month = function(){ return _self.working_date.getMonth(); };
    _self.day = function(){   return _self.working_date.getDate(); };
    _self.year = function(){  return _self.working_date.getFullYear(); };
    _self.cal = function(monday_first){ return _self.split_by_weeks(monday_first); }

    _self.get_month_name = function(){
        var month_names = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov", "Dec"];
        return month_names[_self.month()];
    };

    _self.get_month_offset = function(moday_first){
        // Offset for first week
        if(moday_first === undefined){
            moday_first = false;
        }

        var month = _self.month() + 1;
        var date = new Date(month + ' 1 ,' + _self.year());


        if(moday_first){
            return date.getDay() - 1;
        } else {
            return date.getDay();       
        }
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

    _self.split_by_weeks = function(monday_first){
        // Split int array into weeks,
        var days = _self.get_month_len()
        var offset = _self.get_month_offset(monday_first);

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

/**
 * @constructor
 */
var Cal126UI = function(settings){
    var _self = this;    

    _self.template = "\
    <div class='range_item range_item%id%' data-id='%id%'>\
        <div class='calendar_container'><table>\
        <thead>\
        %daynames%\
        </thead>\
        <tbody>%calendar%</tbody></table></div>\
    </div>";

    _self.monday_first_tpl =   "<tr><td class='day_name'>M</td><td class='day_name'>T</td><td class='day_name'>W</td><td class='day_name'>T</td><td class='day_name'>F</td><td class='day_name'>S</td><td class='day_name'>S</td></tr>"
    _self.suterday_first_tpl = "<tr><td class='day_name'>S</td><td class='day_name'>M</td><td class='day_name'>T</td><td class='day_name'>W</td><td class='day_name'>T</td><td class='day_name'>F</td><td class='day_name'>S</td></tr>"

    _self.id = 0;
    _self.daylist = [];
    
    _self.cal = null;

    _self.init = function(settings){

        // Check settings
        if(settings === undefined) settings = {};
        settings = _self.parse_settings(settings);

        // Apply settings to an object
        _self.id = settings['name'];
        _self.parent_id = settings['parent'];
        _self.cal = new Cal126(settings['date']);
        _self.callback = settings['callback'];
        _self.range = settings['range'];
        _self.monday_first = settings['monday_first'];

        // Define events for day ckick and month change
        document.body.addEventListener('click', _self.global_handler, false);

        _self.draw();
    };
    _self.global_handler = function(e){
        var element = e.target || e.srcElement;

        var element_class = " " + element.className + " ";

        if(element_class.indexOf(' cal_day ') !== -1){
            _self.day_choosed.call(element);
        } else if(element_class.indexOf(' next_m ') !== -1){
            _self.switch_to_next_month.call(element);
        } else if(element_class.indexOf(' prev_m ') !== -1){
            _self.switch_to_prev_month.call(element);
        }
    };

    _self.parse_settings = function(settings){
        // Check and fill settings object
        if('name' in settings === false){
            settings['name'] = 'cal126';
        }

        if('date' in settings === false){
            settings['date'] = new Date();
        }

        if('parent' in settings === false){
            settings['parent'] = 'ranges_list';
        }

        if('callback' in settings === false){
            settings['callback'] = function(){};
        }

        if('range' in settings === false){
            settings['range'] = false;
        }

        if('monday_first' in settings === false){
            settings['monday_first'] = false;
        }

        return settings;
    };

    
    _self.day_choosed = function(){
        // On day ckicked
        var _day = this;
        var rotate = ['g', 'b', 'r'];

        var day = _day.getAttribute('data-day');
        var month = _day.getAttribute('data-month');
        var year = _day.getAttribute('data-year');

        if(day == ''){
            return false;
        }
        
        var d = new Date(year, month, day);
        var type = false;
        if(_self.day_exist(d)){
            type = _self.day_type(d);
        }

        _self.remove_day(d);
        if(type === false){
            _self.add_day(d, 'g');
        } else if (type === 'g'){
            _self.add_day(d, 'b');
        } else if (type === 'b'){
            _self.add_day(d, 'r');
        } else if (type === 'r'){
            _self.remove_day(d);
        }

        _self.draw();
        _self.save_daylist();
    };

    _self.save_daylist = function(){
        var serialized = JSON.stringify( _self.daylist );
        _settings.set('calendar', serialized);
    };

    _self.load_daylist = function(daylist){
        for (var i = daylist.length - 1; i >= 0; i--) {
            daylist[i][0] = new Date(daylist[i][0]);
        };
        _self.daylist = daylist;
        _self.draw();
    };

    _self.add_day = function(d, color){
        // Search for dup
        // _self.remove_day(d);
        _self.daylist.push([d, color]);

        if(_self.range) _self.fill_days();

        _self.callback(_self.daylist);
    };
    _self.remove_day = function(d){
        for (var i=0; i < _self.daylist.length; i++) {
            if( _self.date_helper.compare_dates(_self.daylist[i][0], d ) ){
                _self.daylist.splice(i, 1);
            }
        };
        if(_self.range) _self.fill_days();

        _self.callback(_self.daylist);
    };
    
    _self.day_exist = function(d){
        for (var i=0; i < _self.daylist.length; i++) {
            if( _self.date_helper.compare_dates(_self.daylist[i][0], d ) ) {
                return true;
            }
        };
        return false;
    };
    _self.day_type = function(d){
        for (var i=0; i < _self.daylist.length; i++) {
            if( _self.date_helper.compare_dates(_self.daylist[i][0], d ) ) {
                return _self.daylist[i][1];
            }
        };
        return false;
    };
    
    _self.first_day = function(){
        var x = 42 * 9999999999999999;
        var first = false;
        for (var i=0; i < _self.daylist.length; i++) {
            if( _self.daylist[i][0].getTime() < x ) {
                x = _self.daylist[i][0].getTime();
                first = _self.daylist[i];
            }
        };
        return first;
    };
    
    _self.last_day = function(){
        var x = 42; // 0
        var last = false;
        for (var i=0; i < _self.daylist.length; i++) {
            if( _self.daylist[i][0].getTime() > x ) {
                x = _self.daylist[i][0].getTime();
                last = _self.daylist[i];
            }
        };
        return last;
    };
    
    _self.fill_days = function(){
        var first = _self.first_day();
        var last = _self.last_day();
        if(first == false || last == false ||   _self.date_helper.compare_dates(first, last)){
            return false;
        }

        var next = _self.date_helper.change_date(first, 1);
        while(_self.date_helper.compare_dates(first, last) == false && next.getTime() < last.getTime()){
            if(_self.day_exist(next) == false){
                _self.daylist.push([next, '']);
            }

            next = _self.date_helper.change_date(next, 1);
        }
        
    };

    _self.clear_days = function(){
        _self.daylist = [];
        _self.draw();
    };
    
    _self.switch_to_prev_month = function(){
        var m = _self.cal.month();
        var y = _self.cal.year();
        if( m == 0 ){
            m = 11;
            y -= 1;
        } else {
            m -= 1;
        }
        
        _self.cal.set_date(new Date(y, m, 1));
        _self.draw();
    };
    
    _self.switch_to_next_month = function(){
        var m = _self.cal.month();
        var y = _self.cal.year();
        if( m == 11 ){
            m = 0;
            y += 1;
        } else {
            m += 1;
        }
        
        // Probably ok      
        _self.cal.set_date(new Date(y, m, 1));
        _self.draw();
    };
    
    _self.build_calendar = function(){
        var w = _self.cal.cal(_self.monday_first);

        var week_tpl = '<tr>%week%</tr>';
        var day_tpl = '<td class="cal_day %extraclass%" data-month="%month%" data-year="%year%" data-day="%day%">%day%</td>';
        var result = '';


        function is_week_end(dayn){
            var week_ends = [0, 6];
            if(_self.monday_first){
                week_ends = [5, 6];
            }

            for (var i = week_ends.length - 1; i >= 0; i--) {
                if(week_ends[i] == dayn){
                    return true;
                }
            };
            return false;
        }
        
        for (var i=0; i < w.length; i++) {
            var week_tmp = '';
            for (var d=0; d < w[i].length; d++) {
                if ( w[i][d] == 0 ){
                    w[i][d] = '';
                }
                
                var some_date = new Date(_self.cal.year(), _self.cal.month(), w[i][d]);
                var cal_day_selected = _self.day_exist(some_date);
                var date_type_class = '';
                if(cal_day_selected && w[i][d]){
                    date_type_class = ' selected_day_color_' + _self.day_type(some_date) +' ';
                }

                var cal_day_selected_class = '';
                if(cal_day_selected && w[i][d]){
                    cal_day_selected_class += ' cal_day_selected ';
                }

                if(is_week_end(d)){
                    cal_day_selected_class += ' weekend ';
                }

                if(_self.date_helper.compare_dates(new Date(_self.cal.year(), _self.cal.month(), w[i][d]), new Date())){
                    cal_day_selected_class += ' today ';
                }

                cal_day_selected_class += ' ' + date_type_class + ' ';

                week_tmp += day_tpl
                    .replace(/%extraclass%/g, cal_day_selected_class)
                    .replace(/%day%/g, w[i][d])
                    .replace(/%month%/g, _self.cal.month())
                    .replace(/%year%/g, _self.cal.year());
            };
            result += week_tpl.replace(/%week%/g, week_tmp);
        };
        return result;
    };
    
    _self.build = function(){
        var cal = _self.build_calendar();

        if(_self.monday_first){
            var daynames = _self.monday_first_tpl;
        } else {
            var daynames = _self.suterday_first_tpl;
        }
                                    

        return _self.template
            .replace(/%id%/g, _self.id)
            .replace(/%year%/g, _self.cal.get_month_name() + " " + _self.cal.year() )
            .replace(/%daynames%/g, daynames)
            .replace(/%calendar%/g, cal);
    };

    _self.draw = function(){
        var list_container = document.getElementById(_self.parent_id)
        list_container.innerHTML = _self.build();
    };

    /**
     * @constructor
     */
    var DateHelper = function(){
        var _self = this;

        /*    Some hacks for working with Date objects.    */
        
        _self.compare_dates = function(d1, d2){
            if(d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()){
                return true
            }
            return false;
        };
        
        _self.change_date = function(d, days){
            if(d === undefined){
                return false;
            }
            var dmod = Math.abs(days);
            var millisecondOffset = dmod * 24 * 60 * 60 * 1000;
            var new_date = 0;

            if(days < 0){
                new_date = d.getTime() - millisecondOffset;
            } else {
                new_date = d.getTime() + millisecondOffset;
            }

            // Ok here      
            var tmp = new Date();
            tmp.setTime(new_date);

            return tmp;
        };
    };

    _self.date_helper = new DateHelper();


    // Initialization
    _self.init(settings);

};
